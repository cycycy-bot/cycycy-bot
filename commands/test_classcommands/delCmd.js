const Command = require('../../base/Command');

class DelCmd extends Command {
  constructor(bot) {
    super(bot, {
      name: 'delcmd',
      description: 'Deletes a custom command in the server',
      usage: '$delcmd <command_name>',
      cooldown: 0,
      permission: 'MODERATOR',
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');
    const commandName = args[0];
    if (!commandName) return this.reply(`Please add a command name ${nam}`);

    this.bot.db.Cmd.deleteOne({ serverID: message.guild.id, commandName }).then((cmdRes) => {
      if (cmdRes.n >= 1) {
        this.reply(`The command ${commandName} has been deleted`);
      } else {
        this.reply(`Command doesn't exists ${nam}`);
      }
    }).catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = DelCmd;
