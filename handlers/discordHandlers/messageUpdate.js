const Discord = require('discord.js');

module.exports = (bot, oldMessage, newMessage) => {
  cb.db.Logger.findOne({ serverID: oldMessage.guild.id }).then((logRes) => {
    if (!logRes) return;
    if (!newMessage.content) return;
    if (oldMessage.content === newMessage.content) return;
    if (logRes.isEnabled && logRes.isEnabled === 'enable') {
      const logEmbed = new Discord.MessageEmbed()
        .setColor('#fffb0a')
        .setAuthor(`[MESSAGE_EDIT] | ${oldMessage.author.username}#${oldMessage.author.discriminator}`, oldMessage.author.avatarURL())
        .addField('Old Message:', oldMessage.content)
        .addField('New Message:', newMessage.content)
        .setFooter(`Old Message ID: ${oldMessage.id}`)
        .setTimestamp();
      return bot.channels.cache.get(logRes.logChannelID).send(logEmbed);
    }
  }).catch(console.error);
};
