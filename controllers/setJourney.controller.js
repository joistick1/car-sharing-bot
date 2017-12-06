'use strict'

const Telegram = require('telegram-node-bot');

class setJourneyController extends Telegram.TelegramBaseCallbackQueryController {
    handle($) {
        console.log("CallBack")
    }
}

module.exports = setJourneyController;
