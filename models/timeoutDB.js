const mongoose = require('mongoose');

const timeout = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: String,
  userName: String,
  serverID: String,
  serverName: String,
  timerName: String,
  timeLeft: Number,
  reason: String,
  date: Date,
});


module.exports = mongoose.model('timeout', timeout);
