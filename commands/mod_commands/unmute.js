const Discord = require('discord.js');
const Command = require('../../base/Command');

class Unmute extends Command {
  constructor(bot) {
    super(bot, {
      name: 'unmute',
      description: 'Unmutes a muted member 4Head',
      usage: '$unmute <member>',
      cooldown: 0,
      permission: 'MODERATOR',
      aliases: ['um'],
      category: 'mod',
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');
    const { Logger } = this.bot.db;

    const unMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    const muteRole = message.guild.roles.find(x => x.name === 'muted');
    if (!unMute) return message.channel.send(`User not found ${nam}`);
    if (!message.member.roles.find(role => role.name === 'Mod cucks')) return message.reply(`You don't have permission for this command ${nam}`);

    if (unMute.roles.find(x => x.name === 'muted')) {
      unMute.removeRole(muteRole.id);

      Logger.findOne({ serverID: message.guild.id }).then((logRes) => {
        const logChannel = this.bot.channels.get(logRes.logChannelID);

        const logEmbed = new Discord.RichEmbed()
          .setColor('#00ff00')
          .setAuthor(`[UNMUTED] | ${unMute.user.username}#${unMute.user.discriminator}`)
          .addField('Executor', message.author.tag, true)
          .setFooter(`USER ID: ${unMute.user.id}`)
          .setTimestamp();
        logChannel.send(logEmbed);
      });
    } else {
      this.respond(`<@${unMute.id}> is not muted!`);
    }
  }
}

module.exports = Unmute;
