const { ChatClient } = require('dank-twitch-irc');
const chalk = require('chalk');
const { mongoose, TwitchLog } = require('../settings/databaseImport');

/**
 * Represents a Twitch client
 * @extends ChatClient
 */
class TwitchClient extends ChatClient {
  /**
   * @param {Object} options The client options used by dank-twitch-irc
   */
  constructor(options) {
    super(options || {});
  }

  /**
   * Initiatilzes events
   */
  init() {
    this.on('PRIVMSG', (message) => {
      const twitchMsg = new TwitchLog({
        _id: mongoose.Types.ObjectId(),
        userID: message.senderUserID,
        userName: message.senderUsername,
        channel: message.channelName,
        message: message.messageText,
        date: new Date(),
      });

      return twitchMsg.save();
    });

    this.on('connect', () => {
      console.log(chalk.green('Twitch client connected'));
    });

    this.connect();
    this.join('cycycy');
  }
}

module.exports = TwitchClient;
