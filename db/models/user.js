let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  "user_id": Number,
  "name": String,
  "phone": String,
  "notification_date": Number
});

let User = mongoose.model('User', UserSchema);

module.exports = User;