const Discord = require('discord.js');
const Command = require('../../base/Command');

class Dog extends Command {
  constructor(bot) {
    super(bot, {
      name: 'dog',
      description: 'Shows random doggos',
      usage: '$dog <breed>(Optional)',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    if (!args[0]) {
      return this.bot.fetch('https://dog.ceo/api/breeds/image/random')
        .then(res => res.json())
        .then((dog) => {
          const doggo = dog.message;
          const dogEmbed = new Discord.RichEmbed()
            .setImage(doggo)
            .setFooter('Powered by dog.ceo');

          return this.respond(dogEmbed);
        })
        .catch(err => this.reply(`Error ${err}`));
    }
    return this.bot.fetch(`https://dog.ceo/api/breed/${args[0]}/images/random`)
      .then(res => res.json())
      .then((dog) => {
        const doggo = dog.message;
        const dogEmbed = new Discord.RichEmbed()
          .setImage(doggo)
          .setFooter('Powered by dog.ceo');

        return this.respond(dogEmbed);
      })
      .catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = Dog;
