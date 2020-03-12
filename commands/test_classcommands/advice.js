const Discord = require('discord.js');
const Commands = require('../../base/Command');

class Advice extends Commands {
  constructor(bot) {
    super(bot, {
      name: 'advice',
      description: 'Gives advice',
      usage: '$advice',
      aliases: ['adv'],
      cooldown: 0,
    });
  }

  async run(message, args) {
    const OMGScoots = this.bot.emojis.find(emoji => emoji.name === 'OMGScoots');
    this.fetch('https://api.adviceslip.com/advice')
      .then(res => res.json())
      .then((res) => {
        const cookieEmbed = new Discord.RichEmbed()
          .setColor(3447003)
          .addField(`${message.author.username} here is your advice ${OMGScoots}`, res.slip.advice);
        super.respond(cookieEmbed);
      })
      .catch(err => super.reply(`Error ${err}`));
  }
}

module.exports = Advice;
