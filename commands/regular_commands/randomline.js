const Command = require('../../base/Command');

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
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');
    const clean = msg => msg.replace(/@|#/g, '');
    const { TwitchLog } = this.bot.db;

    const twitchUser = args[0];

    if (!twitchUser) {
      return TwitchLog.countDocuments().then((count) => {
        const random = Math.floor(Math.random() * count);

        TwitchLog.findOne().skip(random).exec((err, res) => {
          const newTime = new Date();
          const ms = newTime - res.date;
          let totalSecs = (ms / 1000);
          const days = Math.floor(totalSecs / 86400);
          const hours = Math.floor(totalSecs / 3600);
          totalSecs %= 3600;
          const minutes = Math.floor(totalSecs / 60);
          const seconds = totalSecs % 60;

          this.respond(`${days > 0 ? `${days}days (${hours}hrs, ${minutes}m ${Math.trunc(seconds)}s) ago` : `${hours}hrs, ${minutes}m${Math.trunc(seconds)}s ago`} \`${res.userName}\`: ${clean(res.message)}`);
        });
      });
    }


    TwitchLog.countDocuments({ userName: twitchUser.toLowerCase() }).then((count) => {
      const random = Math.floor(Math.random() * count);

      TwitchLog.findOne({ userName: twitchUser.toLowerCase() }).skip(random).exec((err, res) => {
        if (!res) return this.respond(`Twitch user not found ${nam}`);
        const newTime = new Date();
        const ms = newTime - res.date;
        let totalSecs = (ms / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor(totalSecs / 3600);
        totalSecs %= 3600;
        const minutes = Math.floor(totalSecs / 60);
        const seconds = totalSecs % 60;

        this.respond(`${days > 0 ? `${days}days (${hours}hrs, ${minutes}m ${Math.trunc(seconds)}s) ago` : `${hours}hrs, ${minutes}m${Math.trunc(seconds)}s ago`} \`${res.userName}\`: ${clean(res.message)}`);
      });
    });
  }
}

module.exports = RandomLine;
