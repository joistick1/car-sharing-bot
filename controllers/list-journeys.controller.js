'use strict'

const Telegram = require('telegram-node-bot');
const fetchDataService = require('../services/fetchdata.service')
const User = require("../db/models/user");
const isAuth = require("../services/check-access.service");
const authentication = require("../services/authentication.service");

class listJourneysController extends Telegram.TelegramBaseController {

    listHandler($) {
    	isAuth.check(User, $)
    		.then(isAuth => {
    			if (isAuth) {
    				const url = `https://dog.ceo/api/breeds/list`
			        fetchDataService.fetchData(url, function(err, res, body) {
			            if (err) {
			                console.log(err);
			                return
			            }
			            const response = JSON.parse(body)
			            const breed = response["message"].map(function(breed) {
			                return {
			                    text: breed, //text of the button
			                    callback: (callbackQuery) => {
			                        const url = `https://dog.ceo/api/breed/${breed}/images/random`;
			                        fetchDataService.fetchData(url, function(err, res, body) {
			                            if (err) {
			                                console.log(err);
			                                return
			                            }
			                            const response = JSON.parse(body);
			                            $.sendMessage(response["message"]);
			                        })
			                    }
			                }
			            });
			            $.runInlineMenu({
			                layout: 2, //some layouting here
			                method: 'sendMessage', //here you must pass the method name
			                params: ['Выбери интересующее направление поездки'], //here you must pass the parameters for that method
			                menu: breed
			            })
			        });
    			} else {
    				authentication.login($, User)
    			}
    		})
        
    }

    get routes() {
        return {
            'listJourneysCommand': 'listHandler'
        }
    }

}

module.exports = listJourneysController;