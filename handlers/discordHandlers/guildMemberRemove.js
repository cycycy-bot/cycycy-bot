const Discord = require('discord.js');
const mongoose = require('mongoose');
const LeaveQueueDB = require('../../models/leaveQueueDB');

module.exports = async (bot, member) => {
  await new Promise(r => setTimeout(r, 250));

  await member.guild.fetchAuditLogs().then((audit) => {
    cb.db.Logger.findOne({ serverID: member.guild.id }).then((logRes) => {
      if (!logRes) return;

      if (logRes.isEnabled && logRes.isEnabled === 'enable') {
        const auditKickedId = audit.entries.first().target.id;
        const memberKickedId = member.user.id;
        if (auditKickedId === memberKickedId && audit.entries.first().action === 'MEMBER_KICK') {
          const { reason } = audit.entries.first();
          const executor = audit.entries.first().executor.username;
          const logEmbed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setAuthor(`[${audit.entries.first().action}] | ${member.user.tag}`, member.user.avatarURL())
            .addField('User', `<@${member.id}>`, true)
            .addField('Reason', reason, true)
            .addField('Executor', executor, true)
            .setFooter(`ID: ${member.id}`)
            .setTimestamp();

          return bot.channels.cache.get(logRes.logChannelID).send(logEmbed);
        } if (logRes.leaveQueueLimit >= 1) {
          LeaveQueueDB.findOne({ serverID: member.guild.id }).then((leaveRes) => {
            if (leaveRes) {
              if ((leaveRes.membersLeft.length + 1) >= logRes.leaveQueueLimit) {
                const bulkLogEmbed = new Discord.MessageEmbed()
                  .setColor('#ff0000')
                  .setAuthor(`[MEMBERS_LEFT] | ${leaveRes.membersLeft.length} members`)
                  .addField('Users', `${leaveRes.membersLeft.map(members => `${members}`).join(' | ')} | ${member.displayName}`)
                  .addField('Reason', 'Left the server')
                  .setTimestamp();

                return bot.channels.cache.get(logRes.logChannelID).send(bulkLogEmbed).then(() => LeaveQueueDB.deleteOne({ serverID: member.guild.id }).then(console.log('guild limit deleted')).catch(err => console.log(err)));
              }
              leaveRes.membersLeft.push(member.displayName);
              return leaveRes.save();
            }
            const memberLeave = new LeaveQueueDB({
              _id: mongoose.Types.ObjectId(),
              serverID: member.guild.id,
              serverName: member.guild.name,
              membersLeft: [member.displayName],
            });

            return memberLeave.save().then(console.log).catch(err => `Error: ${err}`);
          }).catch(err => console.log(err));
        }
        const logEmbed = new Discord.MessageEmbed()
          .setColor('#ff0000')
          .setAuthor(`[LEFT] | ${member.user.tag}`, member.user.avatarURL())
          .addField('User', `<@${member.id}>`, true)
          .addField('Reason', 'left the server', true)
          .setFooter(`ID: ${member.id}`)
          .setTimestamp();

        return bot.channels.cache.get(logRes.logChannelID).send(logEmbed);
      }
    }).catch(console.log);
  }).catch(console.log);
};
