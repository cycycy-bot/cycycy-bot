const Cybot = require('./base/Cybot');
const TwitchClient = require('./base/Twitch');
require('./Server');

require('dotenv').config();

require('./utils/helpers');

const bot = new Cybot({ config: '../botconfig.json' });
const twitch = new TwitchClient({ username: 'cycycybot', password: process.env.TWITCH_AUTH, config: '../botconfig.json' });

bot.init();
twitch.init();
