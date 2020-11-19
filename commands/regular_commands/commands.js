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
    const { Cmd } = this.bot.db;

    Cmd.find({ serverID: message.guild.id }).then((res) => {
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
      // const joined = cmdArr.join(' \n');

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
