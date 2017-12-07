'use strict'
const config = require("./config.json");
const TOKEN = config.token;
const Telegram = require('telegram-node-bot');
const tg = new Telegram.Telegram(TOKEN, {
	workers: 1
});


const HelloController = require('./controllers/hello.controller');
const OtherController = require('./controllers/other.controller');
const listJourneysController = require('./controllers/listJourneys.controller');


tg.router
	.when(new Telegram.TextCommand('/hello', 'helloCommand'), new HelloController())
	.when(new Telegram.TextCommand('/list', 'listJourneysCommand'), new listJourneysController())
	.otherwise(new OtherController());
