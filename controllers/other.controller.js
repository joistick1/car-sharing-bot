'use strict'

const Telegram = require('telegram-node-bot');

class OtherController extends Telegram.TelegramBaseController {
	handle($) {
		$.sendMessage('Привет, для списка доступных поездок нажми /list')
	}
}

module.exports = OtherController;
