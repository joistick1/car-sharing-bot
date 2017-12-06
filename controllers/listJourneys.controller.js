'use strict'

const Telegram = require('telegram-node-bot');
const request = require('request');


class listJourneysController extends Telegram.TelegramBaseController {
	listHandler($) {
		console.log($)
		let breed = $.message.text.split(" ")[1];

		if(!breed) return $.sendMessage("Sorry, please type a breed");
		
		this.getJourneysList($, breed);
	}

	applyHandler($) {
		$.Update('callback_query', function (msg) {
			  console.log(msg.data)
			});
	}

	getJourneysList($, breed) {
		//const url = `https://dog.ceo/api/breed/${breed}/images/random` // input your url here
		const url = `https://dog.ceo/api/breeds/list`;

		// use a timeout value of 10 seconds
		const timeoutInMilliseconds = 10*1000
		const opts = {
		  url: url,
		  timeout: timeoutInMilliseconds
		}

		request(opts, function (err, res, body) {
		  if (err) {
		    console.log(err);
		    return
		  }
		  const breed = JSON.parse(body)["message"].slice(0,4).map(function(i, val) {
		  	return [{ text: i, callback_data: val }]
		  });

		  var options = {
		    reply_markup: JSON.stringify({
		      inline_keyboard: breed
		    })
		  };

		  $.sendMessage("Выберите породу: ", options);

		})
	}
	get routes() {
		return {
			'listJourneysCommand': 'listHandler',
			'applyJourneyCommand': 'applyHandler'

		}
	}
}

module.exports = listJourneysController;
