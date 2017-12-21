'use strict'

const Telegram = require('telegram-node-bot');
const User = require("../db/models/user");
const isAuth = require("../services/check-access.service");
const authentication = require("../services/authentication.service");

class RemoveUserController extends Telegram.TelegramBaseController {
    removeHandler($) {    	
    	isAuth.check(User, $)
    		.then(isAuth => {
    			if (isAuth["valid"]) {
    				const chatId = $.message.from.id;
                    $.sendMessage(`Вы действительно хотите удалить Вашу учетную запись?`, {
                        'parse_mode': 'Markdown',
                        'reply_markup': JSON.stringify({
                            "keyboard": [
                                ["Да"],
                                ["Нет"]
                            ],
                            "one_time_keyboard": true,
                            "resize_keyboard": true
                        })
                    });
                    $.waitForRequest
                        .then($ => {
                            if ($.message.text === "Да") {
                                authentication.remove($, User, chatId);
                                return;
                            }
                            $.sendMessage(`Спасибо, что остаетесь с нами`);
                        });
                    
    			} else {
                    authentication.login($, User);
    			}
    		});
    }

    get routes() {
        return {
            'removeUserCommand': 'removeHandler'
        }
    }
}

module.exports = RemoveUserController;
