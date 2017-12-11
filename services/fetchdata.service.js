const request = require('request');

module.exports = {
    fetchData(string_url, cb) {
        const url = string_url

        // use a timeout value of 10 seconds
        const timeoutInMilliseconds = 10*1000
        const opts = {
          url: url,
          timeout: timeoutInMilliseconds
        }

        request(opts, function (error, response, body) {
            cb(error, response, body)
        });
    }
}