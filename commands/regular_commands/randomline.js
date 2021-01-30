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
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');
    const clean = msg => msg.replace(/@|#/g, '');
    const { TwitchLog } = cb.db;

    const twitchUser = args[0];

    if (!twitchUser) {
      TwitchLog.aggregate([{ $sample: { size: 1 } }]).then((res) => {
        const newTime = new Date();
        const ms = newTime - res[0].date;
        let totalSecs = (ms / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor(totalSecs / 3600);
        totalSecs %= 3600;
        const minutes = Math.floor(totalSecs / 60);
        const seconds = totalSecs % 60;

        this.respond(`${days > 0 ? `${days}days (${hours}hrs, ${minutes}m ${Math.trunc(seconds)}s) ago` : `${hours}hrs, ${minutes}m${Math.trunc(seconds)}s ago`} \`${res[0].userName}\`: ${clean(res[0].message)}`);
      });
      return;
    }

    TwitchLog.aggregate([
      { $match: { channel: 'lacari', userName: twitchUser.toLowerCase() } },
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

      this.respond(`${days > 0 ? `${days}days (${hours}hrs, ${minutes}m ${Math.trunc(seconds)}s) ago` : `${hours}hrs, ${minutes}m${Math.trunc(seconds)}s ago`} \`${res[0].userName}\`: ${clean(res[0].message)}`);
    });
  }
}

module.exports = RandomLine;
