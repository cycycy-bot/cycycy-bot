const Discord = require('discord.js');
const Command = require('../../base/Command');

class DogFact extends Command {
  constructor(bot) {
    super(bot, {
      name: 'dogfact',
      description: 'Shows random doggo facts',
      usage: '$dogfact',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    cb.fetch('https://dog-api.kinduff.com/api/facts')
      .then(res => res.json())
      .then((fact) => {
        const factEmbed = new Discord.MessageEmbed()
          .setColor('#1fca05')
          .setDescription(fact.facts[0])
          .setFooter('Powered by kinduff/dog-api');

        return this.respond(factEmbed);
      })
      .catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = DogFact;
