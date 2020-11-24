const mongoose = require('mongoose');

const twitchLog = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: String,
  userName: String,
  channel: { type: String, index: true },
  message: String,
  date: Date,
});


module.exports = mongoose.model('twitchLog', twitchLog);
