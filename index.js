'use strict'
const config = require("./config.json");
const TOKEN = config.token;
const Telegram = require('telegram-node-bot');
const tg = new Telegram.Telegram(TOKEN, {
	workers: 1
});
const db = require("./db");

const CheckAuthController = require('./controllers/check-auth.controller');
const StartController = require('./controllers/start.controller');
const OtherController = require('./controllers/other.controller');
const listJourneysController = require('./controllers/list-journeys.controller');


tg.router
	.when(new Telegram.TextCommand('/start', 'startCommand'), new StartController())
	.when(new Telegram.TextCommand('/list', 'listJourneysCommand'), new listJourneysController())
	.otherwise(new CheckAuthController());