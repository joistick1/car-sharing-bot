'use strict'

const Telegram = require('telegram-node-bot');

class StartController extends Telegram.TelegramBaseController {
	startHandler($) {
		$.sendMessage('Нажми /list чтобы вывести список актуальных направлений');

	}

	get routes() {
		return {
			'startCommand': 'startHandler'
		}
	}
}

module.exports = StartController;
