'use strict'
const config = require("./config.json");
const TOKEN = config.token;
const Telegram = require('telegram-node-bot');
const tg = new Telegram.Telegram(TOKEN, {
	workers: 2
});

const HelloController = require('./controllers/hello.controller');
const OtherController = require('./controllers/other.controller');
const listJourneysController = require('./controllers/listJourneys.controller');
const setJourneyController = require('./controllers/setJourney.controller');

tg.router
	.when(new Telegram.TextCommand('/hello', 'helloCommand'), new HelloController())
	.when(new Telegram.TextCommand('/list', 'listJourneysCommand'), new listJourneysController())
    	.when(new Telegram.TextCommand('/apply', 'applyJourneyCommand'), new listJourneysController())
	.otherwise(new setJourneyController());
