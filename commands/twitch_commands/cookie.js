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
    cb.fetch('http://fortunecookieapi.herokuapp.com/v1/cookie')
      .then(res => res.json())
      .then((res) => {
        const cookieString = `${message.senderUsername} here is your cookie for the day: ${res[0].fortune.message} 🍪`;
        this.bot.me(message.channelName, cookieString);
      })
      .catch(err => console.error(err));
  }

  async run(message, args) {
    const { mongoose, CookieDB } = cb.db;

    const cookie = new CookieDB({
      _id: mongoose.Types.ObjectId(),
      userID: message.senderUserID,
      userName: message.senderUsername,
      serverId: null,
      serverName: message.channelName,
      date: new Date(),
    });

    CookieDB.findOne({ userID: message.senderUserID }).then((res) => {
      if (!res) {
        return cookie.save().then(() => {
          this.getCookie(message);
        });
      }

      const hours = moment().diff(moment(res.date), 'hours');

      if (hours >= 24) {
        return CookieDB.deleteOne({ userID: message.senderUserID }).then(() => {
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

      return this.bot.me(message.channelName, `@${message.senderUsername}, You can only use this command once per 24hrs (${timeRemainingHrs}hrs, ${timeRemainingMins}m and ${Math.trunc(timeRemainingSecs)}s)`);
    });
  }
}

module.exports = Cookie;
