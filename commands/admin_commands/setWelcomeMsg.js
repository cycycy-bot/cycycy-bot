const Command = require('../../base/Command');

class SetWelcomeMsg extends Command {
  constructor(bot) {
    super(bot, {
      name: 'setwelcomemsg',
      description: 'Sets the welcome message of a guild',
      usage: '$setwelcomemsg <enable/disable> <channel_name> <welcome_msg>',
      permission: 'ADMINISTRATOR',
      cooldown: 1000,
      category: 'admin',
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');
    const { Welcome } = this.bot.db;

    const logChannelName = args[1];
    const channelFinder = message.guild.channels.find(channel => channel.name === logChannelName);
    const welcomeMsg = args.slice(2).join(' ');
    let isEnabled = false;

    if (!channelFinder) return this.respond(`Channel not found ${nam}`);

    if (args[0] === 'enable') {
      isEnabled = true;
    } else if (args[0] === 'disable') {
      isEnabled = false;
    } else {
      isEnabled = null;
    }

    if (isEnabled === null) return this.reply('Please add enable or disable. Use `$help setwelcomemsg` for setting the logger channel.');

    if (isEnabled && welcomeMsg) {
      Welcome.findOneAndUpdate(
        { serverID: message.guild.id },
        {
          serverName: message.guild.name,
          welcomeChannel: channelFinder.id,
          isEnabled,
          welcomeMsg,
        },
        {
          upsert: true,
          new: true,
          useFindAndModify: false,
          setDefaultsOnInsert: true,
        },
        (err, result) => {
          if (err) return this.respond(`Something went wrong: ${err}`);
          if (result) {
            return this.respond(`Welcome message set successfully ${nam}`);
          }
        },
      );
    } else if (!isEnabled) {
      Welcome.findOneAndUpdate(
        { serverID: message.channel.id },
        {
          serverName: message.guild.name,
          isEnabled,
          welcomeMsg: '',
        },
        {
          upsert: true,
          new: true,
          useFindAndModify: false,
          setDefaultsOnInsert: true,
        },
        (err, result) => {
          if (err) return this.respond(`Something went wrong: ${err}`);
          if (result) {
            return this.respond(`Welcome message disabled ${nam}`);
          }
        },
      );
    }
  }
}

module.exports = SetWelcomeMsg;
