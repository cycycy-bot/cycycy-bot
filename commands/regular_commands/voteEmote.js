
const Discord = require('discord.js');
const Canvas = require('canvas');

const checkImage = (src, good, bad) => {
  const img = new Canvas.Image();
  img.onload = good;
  img.onerror = bad;
  img.src = src;
};

module.exports.run = async (bot, message, args, NaM) => {
  const emoteUrl = args[0];
  const emoteName = args[1];
  if (!emoteUrl) return message.reply(`Please add a valid image URL ${NaM}`);
  if (!emoteName) return message.reply(`Please add an emote name after the URL ${NaM}`);
  checkImage(emoteUrl, () => {
    message.channel.send(`A vote for emote ${emoteName} has started!`);
    let thumbsUp = 0;
    let thumpsDown = 0;

    const emoteEmbed = new Discord.RichEmbed()
      .setImage(emoteUrl);
    message.channel.send(emoteEmbed)
      .then((m) => {
        m.react('👍').then(() => {
          m.react('👎');
        });
        const filter = reaction => reaction.emoji.name === '👍' || reaction.emoji.name === '👎';
        const collector = m.createReactionCollector(filter, { time: 10000 });
        collector.on('collect', r => (r.emoji.name === '👍' ? thumbsUp++ : thumpsDown++));
        collector.on('end', collected => console.log(m.reactions));
      })
      .catch(err => message.reply(err));
  }, () => message.reply(`The link doesn't have a valid image that Discord supports ${NaM} only jpeg, jpg, gif and png.`));
};

module.exports.help = {
  name: 'voteemote',
};
