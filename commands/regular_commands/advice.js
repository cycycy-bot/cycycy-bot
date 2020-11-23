const Discord = require('discord.js');
const Command = require('../../base/Command');

class Advice extends Command {
  constructor(bot) {
    super(bot, {
      name: 'advice',
      description: 'Gives advice',
      usage: '$advice',
      aliases: ['adv'],
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const omgScoots = this.bot.emojis.cache.find(emoji => emoji.name === 'OMGScoots');
    cb.fetch('https://api.adviceslip.com/advice')
      .then(res => res.json())
      .then((res) => {
        const cookieEmbed = new Discord.MessageEmbed()
          .setColor(3447003)
          .addField(`${message.author.username} here is your advice ${omgScoots}`, res.slip.advice);
        this.respond(cookieEmbed);
      })
      .catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = Advice;
