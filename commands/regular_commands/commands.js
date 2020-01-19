const discord = require('discord.js');
const Cmd = require('../../models/customCommandsDB');

module.exports.run = async (bot, message) => {
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

    const serverCmdEmbed = new discord.RichEmbed()
      .setDescription('Server Commands')
      .setColor('#23ff74');

    for (let i = 0; i < cmdArr.length; i++) {
      serverCmdEmbed.addField(' ‏‏‎ ', cmdArr[i].join(' \n'), true);
    }

    return message
      .channel
      .send(serverCmdEmbed);
  }).catch(err => message.reply(`Error ${err}`));
};

module.exports.help = {
  name: 'commands',
};
