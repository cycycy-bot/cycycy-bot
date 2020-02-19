module.exports = (bot) => {
  console.log(`${bot.user.username} is online! on ${bot.guilds.size} servers!`);
  bot.user.setActivity('forsan [$help]', { type: 'WATCHING' });
  bot.channels.get('531967060306165796').send(`${bot.user.username} is online on ${bot.guilds.size} servers!`); // my discord's bot test channel
};
