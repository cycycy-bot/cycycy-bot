const Discord = require('discord.js');
const Command = require('../../base/Command');

class UserInfo extends Command {
  constructor(bot) {
    super(bot, {
      name: 'userinfo',
      description: 'Shows the user\'s information',
      usage: '$userinfo <user>(optional)',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');

    const users = message.guild.member(message.mentions.users.first() || message.author);
    if (!users) return this.respond(`User not found ${nam}`);

    const userIcon = users.user.displayAvatarURL;
    const userEmbed = new Discord.RichEmbed()
      .setTitle(`${users.user.username} User ID: ${users.user.id}`)
      .setColor(message.guild.member(users).highestRole.color)
      .setThumbnail(userIcon)
      .addField('Game:', message.guild.member(users).presence.game ? message.guild.member(users).presence.game.name : 'Not Playing', true)
      .addField('Created on:', users.user.createdAt)
      .addField('Joined this server on:', users.joinedAt)
      .addField('Roles:', message.guild.member(users).roles.map(s => s).join(' | '), true);
    return this.respond(userEmbed);
  }
}

module.exports = UserInfo;
