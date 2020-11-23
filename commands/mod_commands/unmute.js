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
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');
    const { Mod, Logger } = cb.db;

    const unMute = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    const muteRole = message.guild.roles.cache.find(role => role.name === 'muted');
    if (!unMute) return message.channel.send(`User not found ${nam}`);
    Mod.findOne({ serverID: message.guild.id }).then(async (res) => {
      const serverRole = message.guild.roles.cache.get(res.modName);
      if (!message.member.roles.cache.get(serverRole.id)) return message.reply(`You don't have permission for this command ${nam}`);

      await unMute.roles.remove(muteRole.id);

      Logger.findOne({ serverID: message.guild.id }).then((logRes) => {
        const logChannel = this.bot.channels.cache.get(logRes.logChannelID);

        const logEmbed = new Discord.MessageEmbed()
          .setColor('#00ff00')
          .setAuthor(`[UNMUTED] | ${unMute.user.username}#${unMute.user.discriminator}`)
          .addField('Executor', message.author.tag, true)
          .setFooter(`USER ID: ${unMute.user.id}`)
          .setTimestamp();
        logChannel.send(logEmbed);
        this.reply(`<@${unMute.id}> has been unmuted!`);
      });
    });
  }
}

module.exports = Unmute;
