const { ChatClient } = require('dank-twitch-irc');
require('dotenv').config();

module.exports = (bot) => {
  const clean = message => message.replace(/@|#/g, '');
  const client = new ChatClient({
    username: 'cycycybot',
    password: process.env.TWITCH_AUTH,
  });

  client.on('message', (message) => {
    console.log(message);
  });

  client.on('connect', () => {
    console.log('Twitch client connected');
  });

  client.connect();
  client.join('cycycy');
};
