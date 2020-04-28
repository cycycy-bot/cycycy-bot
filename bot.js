const Cybot = require('./base/Cybot');

require('dotenv').config();

const bot = new Cybot({ config: '../botconfig.json' });

bot.init();
