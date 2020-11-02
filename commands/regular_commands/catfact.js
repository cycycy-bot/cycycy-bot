const Discord = require('discord.js');
const Command = require('../../base/Command');

class CatFact extends Command {
  constructor(bot) {
    super(bot, {
      name: 'catfact',
      description: 'Gives a random cat fact',
      usage: '$catfact',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    this.bot.fetch('https://cat-fact.herokuapp.com/facts/random')
      .then(res => res.json())
      .then((fact) => {
        const factEmbed = new Discord.MessageEmbed()
          .setColor('#1fca05')
          .setDescription(fact.text)
          .setFooter('Powered by cat-fact api');

        return this.respond(factEmbed);
      })
      .catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = CatFact;
