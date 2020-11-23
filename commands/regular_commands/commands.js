const Discord = require('discord.js');
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
      // res.forEach(serverCmd => cmdArr.push(serverCmd.commandName));
      for (let i = 0; i < res.length; i++) {
        if (cmdArrInner.length >= 15) {
          cmdArr.push(cmdArrInner);
          cmdArrInner = [];
        } else {
          cmdArrInner.push(res[i].commandName);
        }
      }
      cmdArr.push(cmdArrInner);
      const joined = cmdArr.join('\r\n');
      const MAX_CHARS = 3 + 2 + joined.length + 3;

      if (MAX_CHARS > 1200) {
        return this.respond('Output exceeded 2000 characters. Sending as a file.', { files: [{ attachment: Buffer.from(joined), name: 'output.txt' }] });
      }

      const serverCmdEmbed = new Discord.MessageEmbed()
        .setDescription('Server Commands')
        .setColor('#23ff74');

      for (let i = 0; i < cmdArr.length; i++) {
        serverCmdEmbed.addField(' ‏‏‎ ', cmdArr[i].join(' \n'), true);
      }

      return this.respond(serverCmdEmbed);
    }).catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = Commands;
