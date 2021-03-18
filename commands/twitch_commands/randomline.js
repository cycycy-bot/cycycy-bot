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
    const { TwitchLog } = cb.db;
    const twitchUser = args[0];

    const twitchChannel = args[1];

    if (!twitchUser) {
      TwitchLog.aggregate([
        { $sample: { size: 1 } },
      ]).then((res) => {
        const newTime = new Date();
        const ms = newTime - res[0].date;
        let totalSecs = (ms / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor(totalSecs / 3600);
        totalSecs %= 3600;
        const minutes = Math.floor(totalSecs / 60);
        const seconds = totalSecs % 60;

        const resMessage = res[0].message;
        const hasAscii = /[^\x20-\x7E]/g.test(resMessage);

        console.log(resMessage);

        this.bot.say(message.channelName, days > 0 ? `(${days}days ago in ${res[0].channel}) ${res[0].userName}: ${hasAscii ? 'contains ASCII characters' : filter.clean(resMessage)}`
          : `(${hours}hrs, ${minutes}m ${Math.trunc(seconds)}s ago in ${res[0].channel}) ${res[0].userName}: ${hasAscii ? 'contains ASCII characters' : filter.clean(resMessage)}`);
      });
      return;
    }

    if (twitchChannel) {
      TwitchLog.aggregate([
        { $match: { userName: twitchUser.toLowerCase(), channel: twitchChannel.toLowerCase() } },
        { $sample: { size: 1 } },
      ]).then((res) => {
        if (!res.length) return this.bot.say(message.channelName, `Twitch channel not found in my DB ${nam}`);

        const newTime = new Date();
        const ms = newTime - res[0].date;
        let totalSecs = (ms / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor(totalSecs / 3600);
        totalSecs %= 3600;
        const minutes = Math.floor(totalSecs / 60);
        const seconds = totalSecs % 60;

        const resMessage = res[0].message;
        const hasAscii = /[^\x20-\x7E]/g.test(resMessage);

        console.log(resMessage);

        this.bot.say(message.channelName, days > 0 ? `(${days}days ago in ${res[0].channel}) ${res[0].userName}: ${hasAscii ? 'contains ASCII characters' : filter.clean(resMessage)}`
          : `(${hours}hrs, ${minutes}m ${Math.trunc(seconds)}s ago in ${res[0].channel}) ${res[0].userName}: ${hasAscii ? 'contains ASCII characters' : filter.clean(resMessage)}`);
      });
      return;
    }


    TwitchLog.aggregate([
      { $match: { userName: clean(twitchUser.toLowerCase()) } },
      { $sample: { size: 1 } },
    ]).then((res) => {
      if (!res) return this.bot.say(message.channelName, `Twitch user not found in my DB ${nam}`);
      const newTime = new Date();
      const ms = newTime - res[0].date;
      let totalSecs = (ms / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor(totalSecs / 3600);
      totalSecs %= 3600;
      const minutes = Math.floor(totalSecs / 60);
      const seconds = totalSecs % 60;

      const resMessage = res[0].message;
      const hasAscii = /[^\x20-\x7E]/g.test(resMessage);

      this.bot.say(message.channelName, days > 0 ? `(${days}days ago in ${res[0].channel}) ${res[0].userName}: ${hasAscii ? 'contains ASCII characters' : filter.clean(resMessage)}`
        : `(${hours}hrs, ${minutes}m ${Math.trunc(seconds)}s ago in ${res[0].channel}) ${res[0].userName}: ${hasAscii ? 'contains ASCII characters' : filter.clean(resMessage)}`);
    });
  }
}

module.exports = RandomLine;
