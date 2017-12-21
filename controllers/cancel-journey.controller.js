'use strict'

const Telegram = require('telegram-node-bot');
const User = require("../db/models/user");
const isAuth = require("../services/check-access.service");
const authentication = require("../services/authentication.service");
const notification = require("../services/notification.service");
const schedule = require('node-schedule');

class CancelJourneyController extends Telegram.TelegramBaseController {
    cancelHandler($) {
        isAuth.check(User, $)
            .then(isAuth => {
                if (isAuth["valid"]) {
                    const query = {
                        user_id: $.message.from.id
                    };
                    const journey = isAuth["user_object"]["notification"]["journey_name"];
                    if (`job-${query["user_id"]}` in schedule.scheduledJobs) {
                        const current_job = schedule.scheduledJobs[`job-${query["user_id"]}`]
                        current_job.cancel();
                    }
                    notification.cancel($, User, query, journey);
                } else {
                    authentication.login($, User)
                }
            });
    }

    get routes() {
        return {
            'cancelJourneyCommand': 'cancelHandler'
        }
    }
}

module.exports = CancelJourneyController;