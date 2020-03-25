const Command = require('../../base/Command');

class SetLogger extends Command {
  constructor(bot) {
    super(bot, {
      name: 'setlogger',
      description: 'Sets the logger channel',
      usage: '$setlogger <enable/disable> <channel_name>(case sensitive)',
      permission: 'ADMINISTRATOR',
      cooldown: 1000,
      category: 'admin',
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');
    const { mongoose, Logger } = this.bot.db;

    const logChannelName = args[1];
    const channelFinder = message.guild.channels.find(channel => channel.name === logChannelName);
    const isEnabled = args[0];

    if (!isEnabled) return this.reply('Please add enable or disable. Use `$help setlogger` for setting the logger channel.');
    if (isEnabled === 'enable' && channelFinder) {
      const logger = new Logger({
        _id: mongoose.Types.ObjectId(),
        serverID: message.guild.id,
        serverName: message.guild.name,
        logChannelID: channelFinder.id,
        isEnabled,
      });

      Logger.findOne({ serverID: message.guild.id }).then((res) => {
        if (res) {
          return Logger.updateOne({ serverID: message.guild.id },
            {
              isEnabled,
              logChannelID: channelFinder.id,
              serverName: message.guild.name,
            })
            .then(this.respond(`Logger channel has been set to ${channelFinder}`))
            .catch(err => this.reply(`Error ${err}`));
        }
        return logger.save()
          .then(this.respond('Logger channel added successfully!'))
          .catch(err => this.reply(`Error ${err}`));
      }).catch(err => this.reply(`Error ${err}`));
    } else if (isEnabled === 'disable') {
      Logger.findOne({ serverID: message.guild.id }).then((res) => {
        if (res) {
          return Logger.updateOne({ serverID: message.guild.id },
            {
              isEnabled,
              logChannelID: '',
            })
            .then(this.respond('Logger disabled successfully!'))
            .catch(err => this.reply(`Error ${err}`));
        }
        return this.respond(`Logger has not been setup in this server yet${nam}Please use \`$setlogger help\` for more info.`);
      }).catch(err => this.reply(`Error ${err}`));
    } else {
      return this.respond('An error has occured. Use `$help setlogger` for setting the logger channel.');
    }
  }
}

module.exports = SetLogger;
