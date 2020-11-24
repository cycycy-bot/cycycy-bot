const Discord = require('discord.js');

module.exports = (bot, message) => {
  if (message.channel.type === 'dm') return;
  const logger = (logArgs) => {
    cb.db.Logger.findOne({ serverID: message.guild.id }).then((logRes) => {
      if (!logRes) return;
      if (logRes.isEnabled && logRes.isEnabled === 'enable') {
        const logEmbed = new Discord.MessageEmbed()
          .setColor('#ff0000')
          .setAuthor(`[MESSAGE_DELETE] | ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL())
          .addField('User', `<@${message.author.id}>`, true)
          .addField('Reason', logArgs, true)
          .addField('Channel', `<#${message.channel.id}>`, true)
          .setFooter(`MESSAGE ID: ${message.id}`)
          .setTimestamp();
        if (message.content) {
          logEmbed.addField('Message', message.content);
        } else if (message.attachments.size >= 1) {
          logEmbed.setImage(message.attachments.get(message.attachments.firstKey()).proxyURL);
        }
        return bot.channels.cache.get(logRes.logChannelID).send(logEmbed);
      }
    }).catch(console.error);
  };

  cb.db.BanPhrase.find({ serverID: message.guild.id }).then((banPhrase) => {
    let bpIdentifier = false;
    banPhrase.forEach((banPhraseItems) => {
      if (message.content.toUpperCase().includes(banPhraseItems.banphrase.toUpperCase())) {
        bpIdentifier = true;
        return logger(`Match ban phrase: **${banPhraseItems.banphrase}**`);
      }
    });
    if (!bpIdentifier) {
      return logger('Message deleted');
    }
  });
};
