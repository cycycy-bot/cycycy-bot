const mongoose = require('mongoose');

const cookie = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: String,
  userName: String,
  serverID: String,
  serverName: String,
  date: Date,
});


module.exports = mongoose.model('cookie', cookie);
