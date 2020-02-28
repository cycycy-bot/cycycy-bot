const Command = require('../../base/Command');

class EditCmd extends Command {
  constructor(bot) {
    super(bot, {
      name: 'editcmd',
      description: 'Edits a custom command in the server',
      usage: '$editcmd <command_name> <command_response>',
      cooldown: 0,
      permission: 'MODERATOR',
    });
  }

  run(message, args, NaM) {
    const commandName = args[0];
    const cmdRes = args.slice(1);
    if (!commandName) return this.reply(`Please add a command name ${NaM}`);
    if (!cmdRes) return this.reply(`Please add a command response ${NaM}`);

    this.bot.db.Cmd.updateOne({ serverID: message.guild.id, commandName },
      {
        commandRes: cmdRes.join(' '),
      })
      .then(this.respond(`Command was changed ${NaM}`))
      .catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = EditCmd;
