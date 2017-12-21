let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  "user_id": Number,
  "name": String,
  "phone": String,
  "notification": {
    "notification_time": Number,
    "active": Boolean,
    "journey_name": String
  }
});

let User = mongoose.model('User', UserSchema);

module.exports = User;