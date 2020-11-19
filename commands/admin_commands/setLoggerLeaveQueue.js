const Command = require('../../base/Command');

class SetLeaveQueue extends Command {
  constructor(bot) {
    super(bot, {
      name: 'setleavequeue',
      description: 'Sets the leave queue for logging',
      usage: '$setleavequeue <integer/number>',
      permission: 'ADMINISTRATOR',
      cooldown: 1000,
      category: 'admin',
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');
    const { Logger } = this.bot.db;

    const leaveLimit = args[0];

    if (!leaveLimit) return this.reply('Please add limit argument. Use `$setleavequeue help` for setting the queue limit.');
    Logger.findOne({ serverID: message.guild.id }).then((res) => {
      if (res && res.isEnabled === 'enable') {
        return Logger.updateOne({ serverID: message.guild.id },
          { leaveQueueLimit: leaveLimit })
          .then(this.reply(`Bot will log who leaves the server when limit is reached: **${leaveLimit}**`))
          .catch(err => this.reply(`Error ${err}`));
      }
      return this.respond(`Logger has not been setup in this server yet${nam}Please use \`$setlogger help\` for more info.`);
    }).catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = SetLeaveQueue;
