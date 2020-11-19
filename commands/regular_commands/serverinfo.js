const Discord = require('discord.js');
const Command = require('../../base/Command');

class ServerInfo extends Command {
  constructor(bot) {
    super(bot, {
      name: 'serverinfo',
      description: 'Shows the server information',
      usage: '$serverinfo',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const serverIcon = message.guild.iconURL();
    const serverEmbed = new Discord.MessageEmbed()
      .setDescription(message.guild.name)
      .setColor('#00b22c')
      .setThumbnail(serverIcon)
      .addField('Created On', message.guild.createdAt)
      .addField('You joined', message.member.joinedAt)
      .addField('Total Members', message.guild.memberCount);
    return this.respond(serverEmbed);
  }
}

module.exports = ServerInfo;
