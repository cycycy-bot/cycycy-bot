const Discord = require('discord.js');

module.exports.run = async (bot, message) => {
  console.log(message.guild.createdTimestamp);
  bot
    .cooldown
    .add(message.author.id);
  setTimeout(() => {
    bot
      .cooldown
      .delete(message.author.id);
  }, 15000);
  const serverIcon = message.guild.iconURL;
  const serverEmbed = new Discord.RichEmbed()
    .setDescription(message.guild.name)
    .setColor('#00b22c')
    .setThumbnail(serverIcon)
    .addField('Created On', message.guild.createdAt)
    .addField('You joined', message.member.joinedAt)
    .addField('Total Members', message.guild.memberCount);
  return message
    .channel
    .send(serverEmbed);
};

module.exports.help = {
  name: 'serverinfo',
};
