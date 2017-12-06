'use strict'

const Telegram = require('telegram-node-bot');

class HelloController extends Telegram.TelegramBaseController {
	helloHandler($) {
		$.sendMessage('Please type "/list breed of a dog (i.e. /list akita" to see it\'s picture');
	}

	get routes() {
		return {
			'helloCommand': 'helloHandler'
		}
	}
}

module.exports = HelloController;
