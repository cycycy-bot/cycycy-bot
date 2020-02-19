const Client = require('./base/cybot');
require('dotenv').config();

const bot = new Client({ config: "../botconfig.json" });

bot.loadCommands('./commands');
bot.loadEvents('./handlers');

bot.login(process.env.BOT_TOKEN);
