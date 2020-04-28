const { ChatClient } = require('dank-twitch-irc');
require('dotenv').config();

module.exports = (bot) => {
  const clean = message => message.replace(/@|#/g, '');
  const twitchDiscordChannel = bot.channels.get('692652832481869884');
  const { mongoose, TwitchLog } = bot.db;
  const client = new ChatClient({
    username: 'cycycybot',
    password: process.env.TWITCH_AUTH,
  });

  client.on('PRIVMSG', (message) => {
    twitchDiscordChannel.send(`\`${message.senderUsername}\`: ${clean(message.messageText)}`);

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

  client.on('connect', () => {
    console.log('Twitch client connected');
  });

  client.connect();
  client.join('cycycy');
};
