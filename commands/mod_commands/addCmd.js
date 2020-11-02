const Command = require('../../base/Command');

class AddCmd extends Command {
  constructor(bot) {
    super(bot, {
      name: 'addcmd',
      description: 'Adds a custom command in the server',
      usage: '$addcmd <command_name> <command_response>',
      cooldown: 0,
      permission: 'MODERATOR',
      category: 'mod',
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');
    const { mongoose, Cmd } = this.bot.db;

    const cmdRes = args.slice(1);
    const resJoined = cmdRes.join(' ');
    const commandName = args[0];
    if (!commandName) return this.reply(`Please add a command name ${nam}`);
    if (!resJoined) return this.reply(`Please add a command response ${nam}`);

    const cmd = new Cmd({
      _id: mongoose.Types.ObjectId(),
      serverID: message.guild.id,
      serverName: message.guild.name,
      commandName: args[0],
      commandRes: resJoined,
    });

    // checks if command exists or not
    const defaultCmd = this.bot.commands.get(commandName) || this.bot.aliases.get(commandName);
    if (!defaultCmd) {
      Cmd.find({ serverID: message.guild.id, commandName }).then((serverRes) => {
        if (serverRes.length >= 1) {
          return this.respond('Command already exists');
        }
        return cmd.save()
          .then(this.respond('Command Added'))
          .catch(err => this.reply(`Error ${err}`));
      });
    } else {
      return this.respond(`The command name is a default command ${nam}`);
    }
  }
}

module.exports = AddCmd;
