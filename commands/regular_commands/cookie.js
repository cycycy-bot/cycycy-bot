const Discord = require('discord.js');
const moment = require('moment');
const cheerio = require('cheerio');
const axios = require('axios');
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

  async getCookie(URL) {
    const { data } = await axios.get('http://www.fortunecookiemessage.com/');
    return cheerio.load(data);
  }

  async run(message, args) {
    const { mongoose, CookieDB } = cb.db;

    const $ = await this.getCookie();

    console.log();

    const cookie = new CookieDB({
      _id: mongoose.Types.ObjectId(),
      userID: message.author.id,
      userName: message.author.username,
      serverId: message.guild.id,
      serverName: message.guild.name,
      date: new Date(),
    });

    CookieDB.findOne({ userID: message.author.id }).then((res) => {
      const cookieRes = $('.cookie-link').text();
      if (!res) {
        return cookie.save().then(() => {
          const cookieEmbed = new Discord.MessageEmbed()
            .setColor(3447009)
            .addField(`${message.author.username} here is your cookie for the day 🍪`, cookieRes);
          this.respond(cookieEmbed);
        });
      }

      const hours = moment().diff(moment(res.date), 'hours');

      if (hours >= 24) {
        return CookieDB.deleteOne({ userID: message.author.id }).then(() => {
          cookie.save().then(() => {
            const cookieEmbed = new Discord.MessageEmbed()
              .setColor(3447009)
              .addField(`${message.author.username} here is your cookie for the day 🍪`, cookieRes);
            this.respond(cookieEmbed);
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
