const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {
  if (args[0] === 'help') {
    message
      .channel
      .send('```Usage: $dog <breed>(Optional)```');
    return;
  }
  if (!args[0]) {
    return fetch('https://dog.ceo/api/breeds/image/random')
      .then(res => res.json())
      .then((dog) => {
        const doggo = dog.message;
        const dogEmbed = new Discord.RichEmbed()
          .setImage(doggo)
          .setFooter('Powered by dog.ceo');

        return message
          .channel
          .send(dogEmbed);
      })
      .catch(err => message.reply(`Error ${err}`));
  }
  return fetch(`https://dog.ceo/api/breed/${args[0]}/images/random`)
    .then(res => res.json())
    .then((dog) => {
      const doggo = dog.message;
      const dogEmbed = new Discord.RichEmbed()
        .setImage(doggo)
        .setFooter('Powered by dog.ceo');

      return message
        .channel
        .send(dogEmbed);
    })
    .catch(err => message.reply(`Error ${err}`));
};

module.exports.help = {
  name: 'dog',
};
