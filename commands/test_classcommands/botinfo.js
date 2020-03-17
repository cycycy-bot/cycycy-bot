const Discord = require('discord.js');

module.exports.run = async (bot, message) => {
  bot
    .cooldown
    .add(message.author.id);
  setTimeout(() => {
    bot
      .cooldown
      .delete(message.author.id);
  }, 15000);
  const forHEad = bot
    .emojis
    .find(emoji => emoji.name === '4HEad');
  const botEmbed = new Discord.RichEmbed()
    .setDescription('Bot Information')
    .setColor('#00b22c')
    .setThumbnail(bot.user.displayAvatarURL)
    .addField(bot.user.username, `Multi-purpose bot for discord ${forHEad}`)
    .addField('Created On', bot.user.createdAt)
    .setFooter('Bot made by cycycy | github repo: github.com/galoncyryll/cycycy-bot', bot.user.displayAvatarURL);

  return message
    .channel
    .send(botEmbed);
};

module.exports.help = {
  name: 'botinfo',
};
