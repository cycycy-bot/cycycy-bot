const tmi = require('tmi.js');
require('dotenv').config();

module.exports = (bot) => {
  const client = new tmi.Client({
    connection: {
      reconnect: true,
      secure: true,
    },
    identity: {
      username: 'cycycybot',
      password: `oauth:${process.env.TWITCH_AUTH}`,
    },
    channels: ['cycycy'],
  });

  client.on('message', (channel, tags, message, self) => {
    if (self) return;
    bot.channels.get('692652832481869884').send(`\`${tags.username}\`: ${message}`);
  });

  client.connect();
};
