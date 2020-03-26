const Cybot = require('./base/Cybot');
const client = require('./base/Twitch');
require('dotenv').config();

const bot = new Cybot({ config: '../botconfig.json' });

client(bot);
bot.init();
