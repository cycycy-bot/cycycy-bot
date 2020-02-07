const Discord = require('discord.js');
const db = require('../settings/databaseImport');

module.exports = (bot, message) => {
  const logger = (logArgs) => {
    db.Logger.findOne({ serverID: message.guild.id }).then((logRes) => {
      if (logRes.isEnabled && logRes.isEnabled === 'enable') {
        const logEmbed = new Discord.RichEmbed()
          .setColor('#ff0000')
          .setAuthor(`[MESSAGE_DELETE] | ${message.author.username}`, message.author.avatarURL)
          .addField('User', `<@${message.author.id}>`, true)
          .addField('Reason', logArgs, true)
          .addField('Channel', `<#${message.channel.id}>`, true)
          .setFooter(`MESSAGE ID: ${message.id}`)
          .setTimestamp();
        if (message.content) {
          logEmbed.addField('Message', message.content);
        } else if (message.attachments.size >= 1) {
          logEmbed.setImage(message
            .attachments
            .get(message
              .attachments
              .firstKey())
            .proxyURL);
        }
        return bot
          .channels
          .get(logRes.logChannelID)
          .send(logEmbed);
      }
    }).catch(console.log);
  };

  db.BanPhrase.find({ serverID: message.guild.id }).then((banPhrase) => {
    let bpIdentifier = false;
    banPhrase.forEach((banPhraseItems) => {
      if (message
        .content
        .toUpperCase()
        .includes(banPhraseItems
          .banphrase
          .toUpperCase())) {
        bpIdentifier = true;
        return logger(`Match ban phrase: **${banPhraseItems.banphrase}**`);
      }
    });
    if (!bpIdentifier) {
      return logger('Message deleted');
    }
  });
};
