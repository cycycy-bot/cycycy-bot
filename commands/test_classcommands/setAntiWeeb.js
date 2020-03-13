const mongoose = require('mongoose');
const AntiWeeb = require('../../models/antiweebDB');

module.exports.run = async (bot, message, args, NaM) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply(`Only administrator have permission for this command ${NaM}`);
  if (args[0] === 'help') {
    return message.reply('```Usage: $setantiweeb <enable/disable>```');
  }
  const isEnabled = args[0];
  const OkayChamp = bot.emojis.find(emoji => emoji.name === 'OkayChamp');
  const DansGame = bot.emojis.find(emoji => emoji.name === 'DansGame');

  if (!isEnabled) return message.reply('Please add enable or disable. Use `$setantiweeb help` for setting the anti weeb channel.');
  if (isEnabled === 'enable') {
    const antiweeb = new AntiWeeb({
      _id: mongoose.Types.ObjectId(),
      serverID: message.guild.id,
      serverName: message.guild.name,
      isEnabled: true,
    });

    AntiWeeb.findOne({ serverID: message.guild.id }).then((res) => {
      if (res) {
        return AntiWeeb.updateOne({ serverID: message.guild.id },
          { isEnabled: true, serverName: message.guild.name }).then(message.channel.send(`Anti weeb is now enabled in this server ${OkayChamp}`)).catch(err => message.reply(`Error ${err}`));
      }
      return antiweeb.save().then(message.channel.send(`Anti weeb is now enabled in this server ${OkayChamp}`)).catch(err => message.reply(`Error ${err}`));
    }).catch(err => message.reply(`Error ${err}`));
  } else if (isEnabled === 'disable') {
    AntiWeeb.findOne({ serverID: message.guild.id }).then((res) => {
      if (res) {
        return AntiWeeb.updateOne({ serverID: message.guild.id },
          { isEnabled: false }).then(message.channel.send(`Anti weeb is disabled ${DansGame}`)).catch(err => message.reply(`Error ${err}`));
      }
      return message.channel.send(`Anti weeb has not been setup in this server yet ${DansGame}`);
    }).catch(err => message.reply(`Error ${err}`));
  } else {
    return message.channel.send('An error has occured. Use `$setantiweeb help` for setting the logger channel.');
  }
};

module.exports.help = {
  name: 'setantiweeb',
};
