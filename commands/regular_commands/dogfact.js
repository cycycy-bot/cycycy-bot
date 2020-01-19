const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {
  if (args[0] === 'help') {
    message
      .channel
      .send('```Usage: $dogfact```');
    return;
  }
  fetch('https://dog-api.kinduff.com/api/facts')
    .then(res => res.json())
    .then((fact) => {
      const factEmbed = new Discord.RichEmbed()
        .setColor('#1fca05')
        .setDescription(fact.facts[0])
        .setFooter('Powered by kinduff/dog-api');

      return message
        .channel
        .send(factEmbed);
    })
    .catch(err => message.reply(`Error ${err}`));
};

module.exports.help = {
  name: 'dogfact',
};
