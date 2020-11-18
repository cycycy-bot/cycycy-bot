const Discord = require('discord.js');
const moment = require('moment');
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

  async getCookie(message) {
    const URL = 'https://www.muppetlabs.de/api/?lang=en&category=cookie';
    this.bot.fetch(URL)
      .then(res => res.json())
      .then((res) => {
        const cookieEmbed = new Discord.MessageEmbed()
          .setColor(3447009)
          .addField(`${message.author.username} here is your cookie for the day 🍪`, res.fortune);
        this.respond(cookieEmbed);
      })
      .catch(err => this.reply(`Error ${err}`));
  }

  async run(message, args) {
    const { mongoose, CookieDB } = this.bot.db;

    const cookie = new CookieDB({
      _id: mongoose.Types.ObjectId(),
      userID: message.author.id,
      userName: message.author.username,
      serverId: message.guild.id,
      serverName: message.guild.name,
      date: new Date(),
    });

    CookieDB.findOne({ userID: message.author.id }).then((res) => {
      if (!res) {
        return cookie.save().then(() => {
          this.getCookie(message);
        });
      }

      const hours = moment().diff(moment(res.date), 'hours');

      if (hours >= 24) {
        return CookieDB.deleteOne({ userID: message.author.id }).then(() => {
          cookie.save().then(() => {
            this.getCookie(message);
          });
        }).catch(err => console.error(err));
      }

      const newDate = new Date();
      const lastDate = res.date;
      const ms = newDate - lastDate;
      const timeRemaining = 86400000 - ms;
      let totalSecs = (timeRemaining / 1000);
      const timeRemainingHrs = Math.floor(totalSecs / 3600);
      totalSecs %= 3600;
      const timeRemainingMins = Math.floor(totalSecs / 60);
      const timeRemainingSecs = totalSecs % 60;

      return this.respond(`You can only use this command once per 24hrs (${timeRemainingHrs}hrs, ${timeRemainingMins}m and ${Math.trunc(timeRemainingSecs)}s)`);
    });
  }
}

module.exports = Cookie;
