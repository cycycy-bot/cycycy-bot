
const Discord = require('discord.js');
const Canvas = require('canvas');

const checkImage = (src, good, bad) => {
  const img = new Canvas.Image();
  img.onload = good;
  img.onerror = bad;
  img.src = src;
};

module.exports.run = async (bot, message, args, NaM) => {
  if (args[0] === 'help') {
    return message.channel.send('```Usage: $voteemote <link_with_image> <emote_name>```');
  }
  const emoteUrl = args[0];
  const emoteName = args[1];
  if (!emoteUrl) return message.reply(`Please add a valid image URL ${NaM}`);
  if (!emoteName) return message.reply(`Please add an emote name after the URL ${NaM}`);
  checkImage(emoteUrl, () => {
    const forHead = '<:4HEad:499105501280469002>';
    const kekega = '<:KEKEGA:647259545676021780>';
    message.channel.send(`A vote for emote \`${emoteName}\` has started! Vote will end in 30mins.`);

    const emoteEmbed = new Discord.RichEmbed()
      .setImage(emoteUrl);
    message.channel.send(emoteEmbed)
      .then((m) => {
        m.react('👍').then(() => {
          m.react('👎');
        });
        const filter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && user.id !== message.author.id;

        const collector = m.createReactionCollector(filter, { time: 1800000 });

        collector.on('end', (collected) => {
          if (!collected) return message.channel.send(`No one has voted to vote ${kekega}`);
          const thumbsup = collected.get('👍');
          const thumbsdown = collected.get('👎');
          const thumbsupCount = thumbsup.users.get(message.author.id) ? thumbsup.count - 1 : thumbsup.count;
          const thumbsdownCount = thumbsdown.users.get(message.author.id) ? thumbsdown.count - 1 : thumbsdown.count;
          if (thumbsupCount === thumbsdownCount) {
            return message.channel.send(`The vote is tied! Therefore the emote won't be added LOOOOL ${forHead}`);
          }

          if (thumbsupCount > thumbsdownCount) {
            return message.guild.createEmoji(emoteUrl, emoteName)
              .then(emoji => message.channel.send(`The brugs have voted to add the \`${emoji.name}\` emote!`))
              .catch(err => message.channel.send(`Error adding the emote: ${err.message}`));
          }
          return message.channel.send(`The brugs don't like to add the emote \`${emoteName}\` ${forHead}`);
        });
      })
      .catch(err => message.reply(err));
  }, () => message.reply(`The link doesn't have a valid image that Discord supports ${NaM} only jpeg, jpg, gif and png.`));
};

module.exports.help = {
  name: 'voteemote',
};
