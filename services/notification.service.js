const {db} = require('../log');
const schedule = require('node-schedule');

module.exports = {
    create($, collection, journey) {
        try {
            const query = {
                user_id: $.message.from.id
            };
            collection.findOne(query, function(err, user) {
                if (!user.notification.active) {
                    updateNotification($, query, collection, journey);
                } else {
                    const chosenJourney = user.notification.journey_name;
                    if (chosenJourney === journey) $.sendMessage(`Вы уже подписаны на ${journey}\nЧтобы отменить поездку нажмите /cancel`)
                    else {
                        $.sendMessage(`Вы уже выбрали поездку ${chosenJourney} ранее\nОтменить ${chosenJourney} и подписаться на ${journey} ?`, {
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
                                    if (`job-${query["user_id"]}` in schedule.scheduledJobs) {
                                        const current_job = schedule.scheduledJobs[`job-${query["user_id"]}`]
                                        current_job.cancel();
                                    }

                                    updateNotification($, query, collection, journey);
                                }
                            })
                    }
                }
            });

        } catch (err) {
            db.error(err.message);
            throw new Error('Failed to create notification');
        }
    },

    cancel($, collection, query, journey) {
        const autoCancelation = false;
        cancelJourney($, collection, query, journey, autoCancelation);
    },

    markActiveJourney(user_journey, journey) {
        if (user_journey === journey) journey += " \u2705"
        return journey
    },

    remove() {
        //some code
    }
};

function updateNotification($, query, collection, journey) {
    collection.update(query, {
        $set: {
            "notification": {
                "notification_time": new Date().getTime() + 120000,
                "active": true,
                "journey_name": journey
            }
        }
    }, function(err, doc) {
        if (err) {
            db.error(err.message);
            throw new Error('Failed to update notification');
        }
        init($, collection, query); // notofication in 2 minutes, later should be changed on real time
        $.sendMessage(`Вы подписались на ${journey}`);
    });
    //$.sendMessage(`Вы подписались на ${journey}`);
}
//init of notification message
function init($, collection, query) {
    collection.findOne(query, function(err, user) {
        if (user) {
            if (user.notification.active) {
                const journey = user.notification.journey_name;
                const time = user.notification.notification_time;
                const y = new Date(time).getFullYear();
                const m = new Date(time).getMonth();
                const d = new Date(time).getDate();
                const h = new Date(time).getHours();
                const mins = new Date(time).getMinutes();
                const date = new Date(y, m, d, h, mins, 0);
                const j = schedule.scheduleJob(`job-${query["user_id"]}`, date, function() {
                    $.sendMessage(`Ваша поездка ${journey} начнется через 10 минут`);
                    finishJourney($, collection, query, j); // journey finishes in 1 minute, later should be changed to 10 minutes
                });
            }
        } else if (err) {
            db.error(err.message);
            throw new Error('Failed to init notification');
        }
    });
}
//journey finishes automatically after it has started
function finishJourney($, collection, query, j) {
    collection.findOne(query, function(err, user) {
        if (user) {
            if (user.notification.active) {
                const journey = user.notification.journey_name;
                const time = user.notification.notification_time;
                const y = new Date(time).getFullYear();
                const m = new Date(time).getMonth();
                const d = new Date(time).getDate();
                const h = new Date(time).getHours();
                const mins = new Date(time + 60000).getMinutes();
                const date = new Date(y, m, d, h, mins, 0);
                j = schedule.scheduleJob(`job-${query["user_id"]}`, date, function() {
                    const autoCancelation = true;
                    cancelJourney($, collection, query, journey, autoCancelation); //set journey status active to false
                });
            }
        } else if (err) {
            db.error(err.message);
            throw new Error('Failed to init notification');
        }
    });
}

function cancelJourney($, collection, query, journey, autoCancelation) {
    collection.update(query, {
        $set: {
            "notification": {
                "active": false,
                "notification_time": 0,
                "journey_name": "No journey"
            }
        }
    }, function(err, doc) {
        if (err) {
            db.error(err.message);
            throw new Error('Failed to cancel notification');
        }
        autoCancelation ? console.log(`Journey ${JSON.stringify(query)} has finished`) : $.sendMessage(`Вы отписались от ${journey}\nЧтобы просмотреть доступные поездки, нажмите /list`);
    });
}