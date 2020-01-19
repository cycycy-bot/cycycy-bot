const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports.run = async (bot, message) => {
  if (bot.cookieCD.has(message.author.id)) {
    const newDate = new Date();
    const lastDate = bot.cookieCD.get(message.author.id);
    const ms = newDate - lastDate;

    const timeRemaining = 86400000 - ms;
    let totalSecs = (timeRemaining / 1000);
    const timeRemainingHrs = Math.floor(totalSecs / 3600);
    totalSecs %= 3600;
    const timeRemainingMins = Math.floor(totalSecs / 60);
    const timeRemainingSecs = totalSecs % 60;

    return message
      .channel
      .send(`You can only use this command once per 24hrs (${timeRemainingHrs}hrs, ${timeRemainingMins}m and ${Math.trunc(timeRemainingSecs)}s)`);
  }
  const date = new Date();
  bot
    .cookieCD
    .set(message.author.id, date);
  setTimeout(() => {
    bot.cookieCD.delete(message.author.id);
  }, 86400000);

  fetch('http://fortunecookieapi.herokuapp.com/v1/cookie')
    .then(res => res.json())
    .then((res) => {
      const cookieEmbed = new Discord.RichEmbed()
        .setColor(3447009)
        .addField(`${message.author.username} here is your cookie for the day 🍪`, res[0].fortune.message);
      message
        .channel
        .send(cookieEmbed);
    })
    .catch(err => message.reply(`Error ${err}`));
};

module.exports.help = {
  name: 'cookie',
};
