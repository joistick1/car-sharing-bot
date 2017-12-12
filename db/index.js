require('dotenv').config()
const mongoose = require('mongoose');
const { db } = require('../log');

// http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;
// http://mongoosejs.com/docs/promises.html
const options = { promiseLibrary: require('bluebird') };

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;

const mongoUri = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

mongoose.connection
  .once("open", () => console.log("Connected to DB"))
  .on('error', db.error)
  .on('close', () => db.log('connection closed'))

mongoose.connect(mongoUri, options);

module.exports = mongoose.connection