const Command = require('../../base/Command');

class EditCmd extends Command {
  constructor(bot) {
    super(bot, {
      name: 'editcmd',
      description: 'Edits a custom command in the server',
      usage: '$editcmd <command_name> <command_response>',
      cooldown: 0,
      permission: 'MODERATOR',
      category: 'mod',
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');
    const { Cmd } = this.bot.db;

    const commandName = args[0];
    const cmdRes = args.slice(1);
    if (!commandName) return this.reply(`Please add a command name ${nam}`);
    if (!cmdRes.length) return this.reply(`Please add a command response ${nam}`);

    Cmd.updateOne({ serverID: message.guild.id, commandName },
      {
        commandRes: cmdRes.join(' '),
      })
      .then((res) => {
        const modified = res.n;
        if (modified >= 1) {
          return this.respond(`Command was changed ${nam}`);
        }
        return this.respond(`No command was found ${nam}`);
      })
      .catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = EditCmd;
