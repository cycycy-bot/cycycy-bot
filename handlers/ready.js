module.exports = (bot) => {
  console.log(`${bot.user.username} is online! on ${bot.guilds.size} servers!`);
  bot.channels.get('531967060306165796').send(`${bot.user.username} is online on ${bot.guilds.size} servers!`); // my discord's bot test channel
  const { status } = require('../botconfig.json');
  const { version } = require('../package.json');
  let i = 0;
  setInterval(() => {
    const toDisplay = `${status[parseInt(i, 10)].name.replace('{serversCount}', bot.guilds.size)} | v${version}`;
    bot.user.setActivity(toDisplay, { type: status[parseInt(i, 10)].type });
    if (status[parseInt(i + 1, 10)]) i++;
    else i = 0;
  }, 30000); // Every 30 seconds
};
