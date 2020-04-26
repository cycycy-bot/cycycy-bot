const Discord = require('discord.js');
const db = require('../settings/databaseImport');

module.exports = async (bot, guild, member) => {
  await new Promise(r => setTimeout(r, 1000));

  await guild.fetchAuditLogs().then((audit) => {
    db.Logger.findOne({ serverID: guild.id }).then((logRes) => {
      const { reason } = audit.entries.first();
      const executor = audit.entries.first().executor.username;
      const avartarURL = `https://cdn.discordapp.com/avatars/${member.id}/${member.avartar}.png`;
      const logEmbed = new Discord.RichEmbed()
        .setColor('#ff0000')
        .setAuthor(`[${audit.entries.first().action}] | ${member.username}#${member.discriminator}`, avartarURL)
        .addField('User', `<@${member.id}>`, true)
        .addField('Reason', reason, true)
        .addField('Executor', executor, true)
        .setFooter(`ID: ${member.id}`)
        .setTimestamp();

      return bot.channels.get(logRes.logChannelID).send(logEmbed);
    });
  });
};
