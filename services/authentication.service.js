const request = require('request');

module.exports = {
    login($, collection) {
        $.sendMessage("Чтобы войти - пердоставьте номер телефона", {
            'parse_mode': 'Markdown',
            'reply_markup': JSON.stringify({
                "keyboard": [
                    [{
                        "text": "Share contact",
                        "request_contact": true
                    }],
                    [{
                        "text": "Reject",
                        "request_contact": false
                    }]
                ],
                "one_time_keyboard": true,
                "resize_keyboard": true
            })
        })
        $.waitForRequest
            .then($ => {
                if ($.message.contact !== null) {
                    $.sendMessage("Вы авторизированы\nЧтобы просмотреть доступные поездки, нажмите /list");
                    const user = {
                        "user_id": $.message.from.id,
                        "name": $.message.from.firstName,
                        "phone": $.message.contact.phoneNumber,
                        "notification": {
                            "notification_time": 0,
                            "active": false,
                            "journey_name": 'No journey'
                        }
                    }
                    this._isUserExists($.message.from.id, collection, function(err, doc) {
                        if (doc.length > 0) {
                            console.log('Such user already exists ');
                        } else {
                            collection.create(user, function(err, doc) {
                                if (doc) {
                                    console.log('user was created', doc);
                                }
                                if (err) {
                                    console.log('user isn\'t created with error', err.toString());
                                    return;
                                }

                            })

                        }


                    })
                } else {
                    $.sendMessage("Без авторизации бот недоступен /start", {
                        'parse_mode': 'Markdown'
                    })
                }
            })
    },

    _isUserExists(chatId, collection, cb) {
        collection.find({
            "user_id": chatId
        }, function(err, doc) {

            cb(err, doc);
        })
    },
    //remove user from db
    remove($, collection, chatId) {
      collection.findOneAndRemove({"user_id": chatId}, function(err,data){
        if(!err) console.log(data);
      });

    }
}