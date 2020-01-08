const Mods = require('../../models/modDBtest');

module.exports.run = async (bot, message, args, NaM) => {
  if (args[0] === 'help') {
    message.reply('Usage: $unmute <user>');
    return;
  }

  Mods.findOne({ serverID: message.guild.id }).then((res) => {
    if (res) {
      const serverRole = message.guild.roles.get(res.modName);
      if ((res.modName === serverRole.id && message.member.roles.has(serverRole.id)) || message.member.hasPermission('ADMINISTRATOR')) {
        const unMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        const muteRole = message.guild.roles.find(x => x.name === 'muted');
        if (!unMute) return message.channel.send(`User not found ${NaM}`);
        if (!message.member.roles.find(role => role.name === 'Mod cucks')) return message.reply(`You don't have permission for this command ${NaM}`);
        if (args[0] === 'help') {
          message.reply('Usage: $unmute <user>');
          return;
        }

        if (unMute.roles.find(x => x.name === 'muted')) {
          unMute.removeRole(muteRole.id);
          message.channel.send(`<@${unMute.id}> has been unmuted!`);
        } else {
          message.channel.send(`<@${unMute.id}> is not muted!`);
        }
      } else {
        return message.reply(`You don't have permission for this command ${NaM}`);
      }
    } else {
      return message.reply(`You haven't set a mod in this server ${NaM}. To set a mod in this server do $setmod help.`);
    }
  }).catch(err => message.reply(`Error ${err}`));
};

module.exports.help = {
  name: 'unmute',
};
