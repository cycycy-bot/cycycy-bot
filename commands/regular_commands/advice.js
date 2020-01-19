const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports.run = async (bot, message) => {
  bot
    .cooldown
    .add(message.author.id);
  setTimeout(() => {
    bot
      .cooldown
      .delete(message.author.id);
  }, 15000);
  const OMGScoots = bot
    .emojis
    .find(emoji => emoji.name === 'OMGScoots');

  fetch('https://api.adviceslip.com/advice')
    .then(res => res.json())
    .then((res) => {
      const cookieEmbed = new Discord.RichEmbed()
        .setColor(3447003)
        .addField(`${message.author.username} here is your advice ${OMGScoots}`, res.slip.advice);
      message
        .channel
        .send(cookieEmbed);
    })
    .catch(err => message.reply(`Error ${err}`));
};

module.exports.help = {
  name: 'advice',
};
