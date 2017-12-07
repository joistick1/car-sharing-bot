'use strict'

const Telegram = require('telegram-node-bot');
const request = require('request');


class listJourneysController extends Telegram.TelegramBaseController {
	
	listHandler($) {
		this.getJourneysList($);
	}	

	getJourneysList($, breed) {
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
		  const breed = JSON.parse(body)["message"].map(function(breed) {
		  	return {
                    	text: breed, //text of the button
                    	callback: (callbackQuery) => {
                        	const url = `https://dog.ceo/api/breed/${breed}/images/random`;
							console.log(url)
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
							  $.sendMessage(JSON.parse(body)["message"])
							 })
                    	}
                	}	
		  });
		$.runInlineMenu({
		    layout: 2, //some layouting here
		    method: 'sendMessage', //here you must pass the method name
		    params: ['Выбери породу, чтобы увидеть фото породы'], //here you must pass the parameters for that method
		    menu: breed
		})
	});
}
	displayPicture($, breed) {
		
	}
	get routes() {
		return {
			'listJourneysCommand': 'listHandler'
		}
	}

}

module.exports = listJourneysController;
