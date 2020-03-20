const Discord = require('discord.js');
const Command = require('../../base/Command');

class Cat extends Command {
  constructor(bot) {
    super(bot, {
      name: 'cat',
      description: 'Shows random cat picture',
      usage: '$cat',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    this.bot.fetch('https://api.thecatapi.com/v1/images/search', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CAT_KEY,
      },
    })
      .then(res => res.json())
      .then((cat) => {
        const { url } = cat[0];
        const catEmbed = new Discord.RichEmbed()
          .setImage(url)
          .setFooter('Powered by thecatpi');

        return this.respond(catEmbed);
      })
      .catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = Cat;
