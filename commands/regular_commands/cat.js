const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {
  if (args[0] === 'help') {
    message
      .channel
      .send('```Usage: $catfact```');
    return;
  }

  fetch('https://api.thecatapi.com/v1/images/search', {
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
        .setFooter('Powered thecatpi');

      return message
        .channel
        .send(catEmbed);
    })
    .catch(err => message.reply(`Error ${err}`));
};

module.exports.help = {
  name: 'cat',
};
