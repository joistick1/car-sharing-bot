'use strict'

const Telegram = require('telegram-node-bot');
const fetchDataService = require('../services/fetchdata.service')
const User = require("../db/models/user");
const isAuth = require("../services/check-access.service");
const authentication = require("../services/authentication.service");
const notification = require("../services/notification.service");

class listJourneysController extends Telegram.TelegramBaseController {

    listHandler($) {
        isAuth.check(User, $)
            .then(isAuth => {
                if (isAuth["valid"]) {
                    const user_journey = isAuth["user_object"]["notification"]["journey_name"];
                    const url = `https://dog.ceo/api/breeds/list`
                    fetchDataService.fetchData(url, function(err, res, body) {
                        if (err) {
                            console.log(err);
                            return
                        }
                        const response = JSON.parse(body)
                        const journeys = response["message"].slice(0, 5).map(function(journey) {
                            const marked_journey = notification.markActiveJourney(user_journey, journey);
                            return {

                                text: marked_journey, //text of the button
                                callback: (callbackQuery) => {
                                    const url = `https://dog.ceo/api/breed/${journey}/images/random`;
                                    fetchDataService.fetchData(url, function(err, res, body) {
                                        if (err) {
                                            console.log(err);
                                            return
                                        }
                                        const response = JSON.parse(body);
                                        $.sendMessage(response["message"]);
                                        notification.create($, User, journey);
                                    })
                                }
                            }
                        });
                        $.runInlineMenu({
                            layout: 2, //some layouting here
                            method: 'sendMessage', //here you must pass the method name
                            params: ['Выбери интересующее направление поездки'], //here you must pass the parameters for that method
                            menu: journeys
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