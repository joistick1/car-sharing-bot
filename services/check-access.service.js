const request = require('request');

module.exports = {
    check(collection, $) {
        return new Promise((resolve, reject) => {
                let isAuth = false;
                collection.find({"user_id": $.message.chat.id}, function(err, doc) {
                isAuth = doc.length > 0 ? true : false;
                resolve(isAuth)
            });
        })
    }
}