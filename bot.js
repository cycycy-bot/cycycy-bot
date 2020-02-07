const Discord = require('discord.js');
require('dotenv').config();

const bot = new Discord.Client();

// Read commands/events handlers
require('./fsCommandReader')(bot);
require('./fsEventsReader')(bot);

// bot commands collection
bot.commands = new Discord.Collection();

// global command cooldown
bot.cooldown = new Set();

// cookie command cooldown
bot.cookieCD = new Map();

// Database
const db = require('./settings/databaseImport');

// connect to MongoDB Atlas
db.mongoose.connect(process.env.DB_PASS,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      bot
        .channels
        .get('531967060306165796')
        .send(`Error connecting to DB: ${err}`);
    }
  });

// error handler
bot.on('error', console.error);

bot.login(process.env.BOT_TOKEN);
