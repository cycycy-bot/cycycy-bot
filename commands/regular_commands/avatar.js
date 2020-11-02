const Discord = require('discord.js');
const Command = require('../../base/Command');

class Avatar extends Command {
  constructor(bot) {
    super(bot, {
      name: 'avatar',
      description: 'Shows the user\'s avatar',
      usage: '$avatar <user> (optional)',
      aliases: ['atr'],
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');

    const aUser = message.guild.member(message.mentions.users.first() || message.author);

    if (!aUser) {
      return this.respond(`User not found ${nam}`);
    }

    const avatarEmbed = new Discord.MessageEmbed()
      .setImage(aUser.user.displayAvatarURL());
    return this.respond(avatarEmbed);
  }
}

module.exports = Avatar;
