const functions = require('firebase-functions');
const Telegraf = require("telegraf");
// const Markup = require('telegraf/markup')
const TELEGRAM = require('./secrets/telegram');
const bot = new Telegraf(TELEGRAM.BOT_TOKEN);
const dateTimeHelpers = require("./utils/dateTime");
const botHelpers = require("./botHelpers");
const DOUBLE_SPACED = "\n\n";
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * Triggered when a new order is created. 
 * Processes the order to send a message to admin through telegram.
 * Side effects: None
 */
exports.onOrderCreated = functions.firestore
  .document('Orders/{orders}')
  .onCreate(async (snap, context) => {
    // TODO: format the message, send message to admin with metada of order id
    const { 
        created_at,
        customerName,
        customerNumber,
        deliveryAddress,
        deliveryCost,
        totalCost,
        orderNumber,
        paymentMethod,
        cart,
        marketId
     } = snap.data();
     var cartDetails = await botHelpers.processCart(cart, marketId);
     var formattedDate = dateTimeHelpers.formatCreateDate(created_at);
     var message = `Order Number: ${orderNumber}(${formattedDate})` + DOUBLE_SPACED
        + cartDetails + DOUBLE_SPACED
        + `Delivery Cost: ${deliveryCost}` + DOUBLE_SPACED
        + `Total Cost: ${totalCost}` + DOUBLE_SPACED
        + `Payment Method: ${paymentMethod}` + DOUBLE_SPACED
        + "Delivery Details:" + DOUBLE_SPACED
        + `Customer Name: ${customerName}` + DOUBLE_SPACED
        + `Contact: ${customerNumber}` + DOUBLE_SPACED
        + `Address: ${deliveryAddress}`;
    return bot.telegram.sendMessage(TELEGRAM.ADMIN_CONTACT, message);
  });

/** Job that runs at the end of every week to reset the Order numbers. */
exports.resetOrderStatisticsWeekly = functions.pubsub.schedule("every sunday 23:59")
  .timeZone("Asia/Singapore")
  .onRun((context) => {
    return botHelpers.admin
      .firestore()
      .collection("Orders")
      .doc("--stats--")
      .delete() // client side will re-create the stats doc if not found, thereby resetting the counter
  })

/** Bot-related scripts */

// use this method and then set webhook instead of using polling with bot.launch() if there are issues.
// see https://github.com/telegraf/telegraf/issues/98
exports.botWebhook = functions.https.onRequest(
    (req, res) => bot.handleUpdate(req.body, res).then(rv => !rv && res.sendStatus(200))
)

// middleware
bot.use(async (ctx, next) => {
    if (ctx.callbackQuery && ctx.callbackQuery.data) {
        const callbackData = JSON.parse(ctx.callbackQuery.data);
        console.log(`Incoming task ${callbackData.cmd} for bot`, ctx.callbackQuery.data)
    }
    return next()
})