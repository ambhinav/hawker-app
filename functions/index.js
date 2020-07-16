const functions = require('firebase-functions');
const Telegraf = require("telegraf");
const Markup = require('telegraf/markup')
const TELEGRAM = require('./secrets/telegram');
const bot = new Telegraf(TELEGRAM.BOT_TOKEN);
const botHelpers = require("./botHelpers");
const admin = require("firebase-admin");
const { StatesEnum } = require('./botHelpers');
const { stringify, parse } = require("zipson");
admin.initializeApp();

/**
 * Triggered when a new order is created. 
 * Processes the order to send a message to admin through telegram.
 * Side effects: None
 */
exports.onOrderCreated = functions.firestore
  .document('Orders/{orders}')
  .onCreate(async (snap, context) => {
    var { cart, cartStoreMappings } = snap.data();
    var storeOrders = await botHelpers.processCart(cart, cartStoreMappings);
    var message = await botHelpers.createAdminMessage(snap.data(), storeOrders);
    return Promise.all([
      bot.telegram.sendMessage(TELEGRAM.ADMIN_CONTACT, message, {
      reply_markup:
        Markup.inlineKeyboard([
          Markup.callbackButton("Paid", stringify({ s: StatesEnum.PAID, id: snap.id, c: 0 })),
          Markup.callbackButton("Cancelled", stringify({ s: StatesEnum.CANCELLED, id: snap.id, c: 0 }))
        ])
      }),
      botHelpers.sendHawkerGroupMessage(snap.data(), storeOrders, bot)  
    ])
  });

/** Job that runs at the end of every week to reset the Order numbers. */
exports.resetOrderStatisticsWeekly = functions.pubsub.schedule("every sunday 23:59")
  .timeZone("Asia/Singapore")
  .onRun((context) => {
    return admin
      .firestore()
      .collection("Orders")
      .doc("--stats--")
      .delete() // client side will re-create the stats doc if not found, thereby resetting the counter
  })

/** Bot-related scripts */
exports.botWebhook = functions.https.onRequest(
    (req, res) => bot.handleUpdate(req.body, res).then(rv => !rv && res.sendStatus(200))
)

bot.catch((err, ctx) => {
    console.log(`Telegraf error for ${ctx.updateType}`, err.response, err.parameters, err.on || err)
})

// middleware
bot.use(async (ctx, next) => {
    if (ctx.callbackQuery && ctx.callbackQuery.data) {
        const callbackData = parse(ctx.callbackQuery.data);
        console.log(`Incoming task ${callbackData.s} for bot`, ctx.callbackQuery.data)
    }
    return next()
})

bot.on("callback_query", async ctx => {
  const msg = ctx.callbackQuery
  const callbackData = parse(msg.data);
  if (callbackData.s == StatesEnum.ORDER_COMPLETED) {
    return ctx.answerCbQuery();
  } else if (callbackData.s == StatesEnum.PAID) {
    if (callbackData.c == 0) { // reconfirm admin's command
      await ctx.editMessageReplyMarkup(
        Markup.inlineKeyboard([
          [Markup.callbackButton("Confirm Paid?", stringify({s: StatesEnum.PAID, id: callbackData.id, c: 1}))],
          [Markup.callbackButton("Go Back", stringify({s: StatesEnum.GO_BACK, id: callbackData.id}))]
        ])
      )    
    } else { // admin has confirmed command
      var id = callbackData.id;
      await botHelpers.updateOrderStatus("paid", id);
      await ctx.editMessageReplyMarkup(
        Markup.inlineKeyboard([Markup.callbackButton("!!Order has been paid!!", JSON.stringify({ s: StatesEnum.ORDER_COMPLETED }))])
      );
    }
    return ctx.answerCbQuery();
  } else if (callbackData.s == StatesEnum.CANCELLED) {
    if (callbackData.c == 0) {
      await ctx.editMessageReplyMarkup(
        Markup.inlineKeyboard([
          [Markup.callbackButton("Confirm Cancelled?", stringify({s: StatesEnum.CANCELLED, id: callbackData.id, c: 1}))],
          [Markup.callbackButton("Go Back", stringify({s: StatesEnum.GO_BACK, id: callbackData.id}))]
        ])
      )    
    } else {
      var id = callbackData.id;
      await botHelpers.updateOrderStatus("cancelled", id);
      await ctx.editMessageReplyMarkup(
        Markup.inlineKeyboard([Markup.callbackButton("!!Order has been cancelled!!", JSON.stringify({ s: StatesEnum.ORDER_COMPLETED }))])
      );
    }
    return ctx.answerCbQuery();
  } else if (callbackData.s == StatesEnum.GO_BACK) {
    var id = callbackData.id;
    await ctx.editMessageReplyMarkup(
      Markup.inlineKeyboard([
        Markup.callbackButton("Paid", stringify({ s: StatesEnum.PAID, id, c: 0 })),
        Markup.callbackButton("Cancelled", stringify({ s: StatesEnum.CANCELLED, id, c: 0 }))
      ])
    )
    return ctx.answerCbQuery();
  }
})