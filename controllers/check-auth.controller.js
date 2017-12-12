'use strict'

const Telegram = require('telegram-node-bot');
const User = require("../db/models/user");
const isAuth = require("../services/check-access.service");
const authentication = require("../services/authentication.service");

class CheckAuthController extends Telegram.TelegramBaseController {
	handle($) {
		isAuth.check(User, $)
    		.then(isAuth => {
    			if (isAuth) {
    				$.sendMessage("Вы авторизированы");
    				$.sendMessage("Чтобы просмотреть доступные поездки, нажмите /list");
    			} else {
    				authentication.login($, User)
    			}
    		})
	}
}

module.exports = CheckAuthController;
