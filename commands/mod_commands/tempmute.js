const ms = require('ms');
const Mods = require('../../models/modDBtest');

module.exports.run = async (bot, message, args, NaM) => {
  const toMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (args[0] === 'help') {
    message.reply('Usage: $tempmute <user> <1s/m/h/d>');
    return;
  }

  Mods.findOne({ serverID: message.guild.id }).then((res) => {
    if (res) {
      const serverRole = message.guild.roles.get(res.modName);
      const PepeS = bot.emojis.find(emoji => emoji.name === 'PepeS');
      if ((res.modName === serverRole.id && message.member.roles.has(serverRole.id)) || message.member.hasPermission('ADMINISTRATOR')) {
        if (!toMute) return message.channel.send(`User not found ${NaM}`);
        if (toMute.id === '487797385691398145') {
          return message.reply(`Can't mute my master ${PepeS}`);
        } if (toMute.hasPermission('ADMINISTRATOR')) {
          return message.reply(`Can't mute administrator ${NaM}`);
        } if (message.member.id === '487797385691398145') {
          console.log('Tempmute command fired by cycycy'); // command for cycycy(owner)
        } if (message.member.hasPermission('ADMINISTRATOR')) {
          console.log(`Admin command from: ${message.guild.name}`); // ignore if admin fired the command
        } if (res.modName === serverRole.id && toMute.roles.has(serverRole.id)) {
          return message.reply(`Can't mute a mod ${NaM}`);
        }

        let muteRole = message.guild.roles.find(role => role.name === 'muted');
        if (!muteRole) {
          try {
            muteRole = message.guild.createRole({
              name: 'muted',
              color: '#ff0000',
              permissions: [],
            });
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
        if (!muteTime || ms(muteTime) === undefined) return message.reply("You didn't specify a time!");
        if (toMute.roles.has(muteRole.id)) return message.reply(`${toMute.user.username} is already muted`);

        toMute.addRole(muteRole);
        message.reply(`<@${toMute.id}> has been muted for ${muteTime}`);

        setTimeout(() => {
          if (toMute.roles.find(x => x.name === 'muted')) {
            toMute.removeRole(muteRole.id);
            message.channel.send(`<@${toMute.id}> has been unmuted!`);
          }
        }, ms(muteTime));
      } else {
        return message.reply(`You don't have permission for this command ${NaM}`);
      }
    } else {
      return message.reply(`You haven't set a mod in this server ${NaM}. To set a mod in this server do $setmod help.`);
    }
  }).catch(err => message.reply(`Error ${err}`));
};

module.exports.help = {
  name: 'tempmute',
};
