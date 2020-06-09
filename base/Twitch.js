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

    /**
     * A set of IDs of the users on cooldown
     * @type {Set}
     */
    this.cooldown = new Set();
  }

  /**
   * Initiatilzes events
   */
  init() {
    this.on('PRIVMSG', (message) => {
      if (message.senderUsername === this.configuration.username) return;

      const twitchMsg = new TwitchLog({
        _id: mongoose.Types.ObjectId(),
        userID: message.senderUserID,
        userName: message.senderUsername,
        channel: message.channelName,
        message: message.messageText,
        date: new Date(),
      });

      // donker
      const donks = ['donk', 'feelsdankman', 'feelsdonkman'];
      if (donks.some(donk => message.messageText.toLowerCase().includes(donk.toLowerCase()))) {
        if (this.cooldown.has(message.senderUserID)) return;
        this.say(message.channelName, 'FeelsDonkMan 👍 ');
        this.cooldown.add(message.senderUserID);

        setTimeout(() => {
          this.cooldown.delete(message.senderUserID);
        }, 10000);
      }

      // trihard
      const trihards = ['tri', 'widehardo'];
      if (trihards.some(tri => message.messageText.toLowerCase().includes(tri.toLowerCase()))) {
        if (this.cooldown.has(message.senderUserID)) return;
        this.say(message.channelName, 'TriHard 7');
        this.cooldown.add(message.senderUserID);

        setTimeout(() => {
          this.cooldown.delete(message.senderUserID);
        }, 10000);
      }

      // pepege
      const pepege = ['pepega', 'pepege'];
      if (pepege.some(pepeg => message.messageText.toLowerCase().includes(pepeg.toLowerCase()))) {
        if (this.cooldown.has(message.senderUserID)) return;
        this.say(message.channelName, 'Pepege Clap');
        this.cooldown.add(message.senderUserID);

        setTimeout(() => {
          this.cooldown.delete(message.senderUserID);
        }, 10000);
      }

      return twitchMsg.save();
    });

    this.on('connect', () => {
      console.log(chalk.green('Twitch client connected'));
      this.say('cycycy', 'Twitch client connected');
    });

    this.connect();
    this.join('cycycy');
  }
}

module.exports = TwitchClient;
