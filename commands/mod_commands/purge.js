const Discord = require('discord.js');
const Command = require('../../base/Command');

class Purge extends Command {
  constructor(bot) {
    super(bot, {
      name: 'purge',
      description: 'Purges a set of message',
      usage: '$purge <number>',
      cooldown: 0,
      permission: 'MODERATOR',
      aliases: ['p'],
      category: 'mod',
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');
    const { Logger } = this.bot.db;

    if (!args[0]) return this.reply(`Please add number of messages ${nam}`);
    if (isNaN(args[0])) return this.reply(`Please use number as arguments. ${nam}`);
    await message.delete();

    return message.channel.bulkDelete(args[0]).then((messages) => {
      Logger.findOne({ serverID: message.guild.id }).then((logRes) => {
        if (logRes.isEnabled && logRes.isEnabled === 'enable') {
          messages.map((messagesItem) => {
            const logEmbed = new Discord.MessageEmbed()
              .setColor('#ff0000')
              .setAuthor(`[PURGED] | ${messagesItem.author.username}`, messagesItem.author.avatarURL())
              .addField('User', `<@${messagesItem.author.id}>`, true)
              .addField('Reason', `Purged by <@${message.author.id}>`, true)
              .addField('Message', messagesItem.content)
              .setFooter(`MESSAGE ID: ${messagesItem.id}`)
              .setTimestamp();

            return this.bot.channels.cache.get(logRes.logChannelID).send(logEmbed);
          });
        }
      }).catch(console.log);
    });
  }
}

module.exports = Purge;
