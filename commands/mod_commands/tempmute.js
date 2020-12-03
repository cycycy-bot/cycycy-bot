const ms = require('ms');
const Discord = require('discord.js');
const Command = require('../../base/Command');

class TempMute extends Command {
  constructor(bot) {
    super(bot, {
      name: 'tempmute',
      description: 'Mutes a member',
      usage: '$tempmute <member> <length>',
      cooldown: 0,
      permission: 'MODERATOR',
      aliases: ['mute', 'tm', 'timeout', 'gulag'],
      category: 'mod',
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');
    const { Mod, Logger } = cb.db;

    const toMute = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    const PepeS = this.bot.emojis.cache.find(emoji => emoji.name === 'PepeS');

    if (!toMute) return message.channel.send(`User not found ${nam}`);

    Mod.findOne({ serverID: message.guild.id }).then(async (res) => {
      const serverRole = message.guild.roles.cache.get(res.modName);

      if (toMute.id === '487797385691398145') {
        return message.reply(`Can't mute my master ${PepeS}`);
      }
      if (toMute.hasPermission('ADMINISTRATOR')) {
        return message.reply(`Can't mute administrator ${nam}`);
      }
      if (message.member.hasPermission('ADMINISTRATOR') && toMute.roles.cache.has(res.modName)) {
        console.log(`${new Date().toLocaleString()}: ${message.author.tag} muted a mod ${toMute.user.username}#${toMute.user.discriminator}`);
      } else if ((res.modName === serverRole.id && message.member.roles.cache.has(serverRole.id)) && toMute.roles.cache.has(res.modName)) {
        return message.reply(`Mod can't mute a mod ${nam}`);
      }


      let muteRole = message.guild.roles.cache.find(role => role.name === 'muted');
      if (!muteRole) {
        const roleData = {
          name: 'muted',
          color: '#ff0000',
          permissions: [],
        };
        try {
          muteRole = await message.guild.roles.create({ data: roleData, reason: 'No Muted Role' });
          message.guild.channels.forEach(async (channel) => {
            await channel.overwritePermissions(muteRole, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false,
            });
          });
        } catch (e) {
          console.log(e.stack);
        }
      }

      const muteTime = args[1];
      const muteReason = args.slice(2);
      const muteReasonJoined = muteReason.join(' ');
      if (!muteTime || ms(muteTime) === undefined) return this.reply("You didn't specify a time!");
      if (toMute.roles.cache.get(muteRole.id)) return this.reply(`${toMute.user.username} is already muted`);

      await toMute.roles.add(muteRole);
      this.reply(`<@${toMute.id}> has been muted for ${muteTime}`);

      Logger.findOne({ serverID: message.guild.id }).then((logRes) => {
        const logChannel = this.bot.channels.cache.get(logRes.logChannelID);
        if (!logChannel) return;

        const logEmbed = new Discord.MessageEmbed()
          .setColor('#ff0000')
          .setAuthor(`[MUTED] | ${toMute.user.username}#${toMute.user.discriminator}`)
          .addField('Executor', message.author.tag)
          .addField('Reason', muteReasonJoined || 'no reason', true)
          .addField('Duration', muteTime, true)
          .setFooter(`USER ID: ${toMute.user.id}`)
          .setTimestamp();
        logChannel.send(logEmbed);

        const unmuteEmbed = new Discord.MessageEmbed()
          .setColor('#00ff00')
          .setAuthor(`[UNMUTED] | ${toMute.user.username}#${toMute.user.discriminator}`)
          .setFooter(`USER ID: ${toMute.user.id}`)
          .setTimestamp();

        setTimeout(() => {
          toMute.roles.remove(muteRole.id);
          logChannel.send(unmuteEmbed);
        }, ms(muteTime));
      });
    });
  }
}

module.exports = TempMute;
