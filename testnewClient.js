const Client = require('./base/Cybot');
require('dotenv').config();

const bot = new Client({ config: '../botconfig.json' });

bot.loadCommands('./commands');
bot.loadEvents('./handlers');

// bot.login(process.env.BOT_TOKEN);
