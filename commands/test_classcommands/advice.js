const Discord = require('discord.js');
const fetch = require('node-fetch');
const Commands = require('../../base/Command');

class Advice extends Commands {
  constructor(bot) {
    super(bot, {
      name: 'advice',
      description: 'Gives advice',
      usage: '$advice',
      cooldown: 0,
    });
  }

  run(bot, message) {
    const OMGScoots = bot.emojis.find(emoji => emoji.name === 'OMGScoots');

    fetch('https://api.adviceslip.com/advice')
      .then(res => res.json())
      .then((res) => {
        const cookieEmbed = new Discord.RichEmbed()
          .setColor(3447003)
          .addField(`${message.author.username} here is your advice ${OMGScoots}`, res.slip.advice);
        super.respond(cookieEmbed);
      })
      .catch(err => message.reply(`Error ${err}`));
  }
}

module.exports = Advice;
