const mongoose = require('mongoose');

const tuckSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: String,
  tucks: [{
      timeStamp: Integer,
      tuckedUserID: String,}],
});

module.exports = mongoose.model('Tuckdb', tuckSchema);
