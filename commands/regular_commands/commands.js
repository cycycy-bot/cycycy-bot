const Command = require('../../base/Command');

class Commands extends Command {
  constructor(bot) {
    super(bot, {
      name: 'commands',
      description: 'Shows custom commands',
      usage: '$commands',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const { Cmd } = cb.db;

    Cmd.find({ serverID: message.guild.id }).then((res) => {
      if (!res.length) return this.respond('No custom commands found in this server. Try `$help` for bot commands.');
      const cmdArr = [];
      let cmdArrInner = [];

      for (let i = 0; i < res.length; i++) {
        if (cmdArrInner.length >= 5) {
          cmdArr.push(cmdArrInner);
          cmdArrInner = [];
          cmdArrInner.push(res[i].commandName);
        } else {
          cmdArrInner.push(res[i].commandName);
        }
      }
      cmdArr.push(cmdArrInner);

      let output = '= Command List = \n\n';

      for (let i = 0; i < cmdArr.length; i++) {
        output += `${cmdArr[i].join(', ')}\n`;
      }

      return this.respond(output, { code: 'asciidoc', split: { char: '\u200b' } });
    }).catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = Commands;
