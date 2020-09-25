const Filter = require('bad-words');
const Command = require('../../base/Command');

const filter = new Filter({ placeHolder: '*' });

class RandomLine extends Command {
  constructor(bot) {
    super(bot, {
      name: 'rl',
      description: 'Random line from cycycy\'s twitch chat logs',
      usage: '$rl <twitch_user>',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const nam = 'NaM';
    const clean = msg => msg.replace(/@|#/g, '');
    const { TwitchLog } = this.bot.db;
    const twitchUser = args[0];
    if (!twitchUser) {
      return TwitchLog.countDocuments({ channel: message.channelName }).then((count) => {
        const random = Math.floor(Math.random() * count);
        TwitchLog.findOne({ channel: message.channelName }).skip(random).exec((err, res) => {
          const newTime = new Date();
          const ms = newTime - res.date;
          let totalSecs = (ms / 1000);
          const days = Math.floor(totalSecs / 86400);
          const hours = Math.floor(totalSecs / 3600);
          totalSecs %= 3600;
          const minutes = Math.floor(totalSecs / 60);
          const seconds = totalSecs % 60;

          const resMessage = res.message;
          const cleanedStr = resMessage.replace(/[^\x20-\x7E]/g, '');

          console.log(resMessage);

          this.bot.say(message.channelName, `${days > 0 ? `${days}days (${hours}hrs, ${minutes}m ${Math.trunc(seconds)}s ago)` : `(${hours}hrs, ${minutes}m${Math.trunc(seconds)}s ago)`} ${res.userName}: ${filter.clean(cleanedStr)}`);
        });
      });
    }


    TwitchLog.countDocuments({ channel: message.channelName, userName: clean(twitchUser.toLowerCase()) }).then((count) => {
      const random = Math.floor(Math.random() * count);

      TwitchLog.findOne({ channel: message.channelName, userName: clean(twitchUser.toLowerCase()) }).skip(random).exec((err, res) => {
        if (!res) return this.bot.say(message.channelName, `Twitch user not found in my DB ${nam}`);
        const newTime = new Date();
        const ms = newTime - res.date;
        let totalSecs = (ms / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor(totalSecs / 3600);
        totalSecs %= 3600;
        const minutes = Math.floor(totalSecs / 60);
        const seconds = totalSecs % 60;

        const resMessage = res.message;
        const cleanedStr = resMessage.replace(/[^\x20-\x7E]/g, '');

        this.bot.say(message.channelName, `${days > 0 ? `${days}days (${hours}hrs, ${minutes}m ${Math.trunc(seconds)}s ago)` : `(${hours}hrs, ${minutes}m${Math.trunc(seconds)}s ago)`} ${res.userName}: ${filter.clean(cleanedStr)}`);
      });
    });
  }
}

module.exports = RandomLine;
