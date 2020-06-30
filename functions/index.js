const functions = require('firebase-functions');
// const admin = require("firebase-admin");
const Telegraf = require("telegraf");
// const Markup = require('telegraf/markup')
const TELEGRAM = require('./secrets/telegram');
const bot = new Telegraf(TELEGRAM.BOT_TOKEN);

// exports.onOrderAdded = functions.firestore
//   .document('Orders/{orders}')
//   .onCreate(async (snap, context) => {
//     // TODO: format the message, send message to admin with metada of order id
//   });

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