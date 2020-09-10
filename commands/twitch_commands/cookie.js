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
    if (this.bot.cookieCD.has(message.senderUserID)) {
      const cookieCDData = this.bot.cookieCD.get(message.senderUserID);

      const newDate = new Date();
      const lastDate = cookieCDData.date;
      const ms = newDate - lastDate;
      const timeRemaining = 86400000 - ms;
      let totalSecs = (timeRemaining / 1000);
      const timeRemainingHrs = Math.floor(totalSecs / 3600);
      totalSecs %= 3600;
      const timeRemainingMins = Math.floor(totalSecs / 60);
      const timeRemainingSecs = totalSecs % 60;

      if (cookieCDData.channel === message.channelName) {
        return this.bot.say(message.channelName, `You can only use this command once per 24hrs (${timeRemainingHrs}hrs, ${timeRemainingMins}m and ${Math.trunc(timeRemainingSecs)}s)`);
      }
    }
    const date = new Date();
    this.bot.cookieCD.set(message.senderUserID, { date, channel: message.channelName });
    setTimeout(() => {
      this.bot.cookieCD.delete(message.senderUserID);
    }, 86400000);

    this.bot.fetch('http://fortunecookieapi.herokuapp.com/v1/cookie')
      .then(res => res.json())
      .then((res) => {
        const cookieString = `${message.senderUsername} here is your cookie for the day 🍪: ${res[0].fortune.message}`;
        this.bot.say(message.channelName, cookieString);
      })
      .catch(err => this.bot.say(message.channelName, `Error ${err}`));
  }
}

module.exports = Cookie;
