const mongoose = require('mongoose');

const twitchUser = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, index: true },
  channel: { type: String, index: true },
});

module.exports = mongoose.model('twitchUser', twitchUser);
