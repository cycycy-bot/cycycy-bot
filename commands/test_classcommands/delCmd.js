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

  run(message, args, NaM) {
    const commandName = args[0];
    if (!commandName) return this.reply(`Please add a command name ${NaM}`);

    this.bot.db.Cmd.deleteOne({ serverID: message.guild.id, commandName }).then((cmdRes) => {
      if (cmdRes.n >= 1) {
        this.reply(`The command ${commandName} has been deleted`);
      } else {
        this.reply(`Command doesn't exists ${NaM}`);
      }
    }).catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = DelCmd;
