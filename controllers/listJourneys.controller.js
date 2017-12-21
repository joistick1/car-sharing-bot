'use strict'

const Telegram = require('telegram-node-bot');
const fetchDataService = require('../services/fetchdata.service')


class listJourneysController extends Telegram.TelegramBaseController {

    listHandler($) {
        const url = `https://dog.ceo/api/breeds/list`
        fetchDataService.fetchData(url, function(err, res, body) {
            if (err) {
                console.log(err);
                return
            }
            const response = JSON.parse(body)
            const breed = response["message"].map(function(breed) {
                return { //returning callback buttons based on response data
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
            //init menu of callback buttons
            $.runInlineMenu({
                layout: 2, //some layouting here
                method: 'sendMessage', //here you must pass the method name
                params: ['Выбери интересующее направление поездки'], //here you must pass the parameters for that method
                menu: breed
            })
        });
    }

    get routes() {
        return {
            'listJourneysCommand': 'listHandler'
        }
    }

}

module.exports = listJourneysController;