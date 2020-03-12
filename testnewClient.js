const Cybot = require('./base/Cybot');
require('dotenv').config();

const bot = new Cybot({ config: '../botconfig.json' });

bot.loadCommands('./commands');
bot.loadEvents('./handlers');
bot.loadDb(process.env.DB_PASS);
bot.login(process.env.TEST_BOT);
