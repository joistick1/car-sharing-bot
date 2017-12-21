const request = require('request');

module.exports = {
    check(collection, $) {
        return new Promise((resolve, reject) => {
            let isAuth = {};
            collection.findOne({
                "user_id": $.message.chat.id
            }, function(err, doc) {
                isAuth["user_object"] = doc;
                isAuth["valid"] = doc !== null ? true : false;
                resolve(isAuth);
            });
        })
    }
}