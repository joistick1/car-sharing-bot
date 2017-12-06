'use strict'

const Telegram = require('telegram-node-bot');

class OtherController extends Telegram.TelegramBaseController {
	handle($) {
		$.sendMessage('А поздороваться ??? Напиши /hello')
	}
}

module.exports = OtherController;