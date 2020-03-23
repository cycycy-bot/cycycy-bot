const Discord = require('discord.js');
const Command = require('../../base/Command');

class Cookie extends Command {
  constructor(bot) {
    super(bot, {
      name: 'cookie',
      description: 'Gives fortune cookie',
      usage: '$cookie',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    if (this.bot.cookieCD.has(message.author.id)) {
      const newDate = new Date();
      const lastDate = this.bot.cookieCD.get(message.author.id);
      const ms = newDate - lastDate;

      const timeRemaining = 86400000 - ms;
      let totalSecs = (timeRemaining / 1000);
      const timeRemainingHrs = Math.floor(totalSecs / 3600);
      totalSecs %= 3600;
      const timeRemainingMins = Math.floor(totalSecs / 60);
      const timeRemainingSecs = totalSecs % 60;

      return this.respond(`You can only use this command once per 24hrs (${timeRemainingHrs}hrs, ${timeRemainingMins}m and ${Math.trunc(timeRemainingSecs)}s)`);
    }
    const date = new Date();
    this.bot.cookieCD.set(message.author.id, date);
    setTimeout(() => {
      this.bot.cookieCD.delete(message.author.id);
    }, 86400000);

    this.bot.fetch('http://fortunecookieapi.herokuapp.com/v1/cookie')
      .then(res => res.json())
      .then((res) => {
        const cookieEmbed = new Discord.RichEmbed()
          .setColor(3447009)
          .addField(`${message.author.username} here is your cookie for the day 🍪`, res[0].fortune.message);
        this.respond(cookieEmbed);
      })
      .catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = Cookie;
