'use strict'

const Telegram = require('telegram-node-bot');

class HelloController extends Telegram.TelegramBaseController {
	helloHandler($) {
		$.sendMessage('Напиши /list чтобы вывести список пород');
	}

	get routes() {
		return {
			'helloCommand': 'helloHandler'
		}
	}
}

module.exports = HelloController;
