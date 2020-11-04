
const Discord = require('discord.js');
const Canvas = require('canvas');
const Command = require('../../base/Command');

const checkImage = (src, good, bad) => {
  const img = new Canvas.Image();
  img.onload = good;
  img.onerror = bad;
  img.src = src;
};

class VoteEmote extends Command {
  constructor(bot) {
    super(bot, {
      name: 'voteemote',
      description: 'Vote for an emote to add/remove',
      usage: '$voteemote <link_with_image> <emote_name>',
      cooldown: 1000,
      aliases: ['ve'],
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');

    const emoteUrl = args[0];
    const emoteName = args[1];
    if (!emoteUrl) return this.reply(`Please add a valid image URL ${nam}`);
    if (!emoteName) return this.reply(`Please add an emote name after the URL ${nam}`);
    checkImage(emoteUrl, () => {
      const forHead = '<:4HEad:499105501280469002>';
      const kekega = '<:KEKEGA:647259545676021780>';
      const YEP = this.bot.emojis.cache.find(emoji => emoji.name === 'YEP');
      const NOP = this.bot.emojis.cache.find(emoji => emoji.name === 'NOP');
      this.respond(`A vote for emote \`${emoteName}\` has started! Vote will end in 30mins.`);

      const emoteEmbed = new Discord.MessageEmbed()
        .setImage(emoteUrl);
      this.respond(emoteEmbed)
        .then((m) => {
          m.react(YEP).then(() => {
            m.react(NOP);
          });
          const filter = (reaction, user) => [YEP.name, NOP.name].includes(reaction.emoji.name) && user.id !== message.author.id;

          const collector = m.createReactionCollector(filter, { time: 1800000 });

          collector.on('end', (collected) => {
            if (!collected) return this.respond(`No one has voted to vote ${kekega}`);
            console.log(collected);
            const thumbsup = collected.get(YEP.id);
            const thumbsdown = collected.get(NOP.id);
            const thumbsupCount = thumbsup.users.cache.get(message.author.id) ? thumbsup.count - 1 : thumbsup.count;
            const thumbsdownCount = thumbsdown.users.cache.get(message.author.id) ? thumbsdown.count - 1 : thumbsdown.count;
            if (thumbsupCount === thumbsdownCount) {
              return this.respond(`The vote is tied! Therefore the \`${emoteName}\` emote won't be added LOOOOL ${forHead}`);
            }

            if (thumbsupCount > thumbsdownCount) {
              return message.guild.emojis.create(emoteUrl, emoteName)
                .then(emoji => this.respond(`The brugs have voted to add the \`${emoji.name}\` emote!`))
                .catch(err => this.respond(`Error adding the \`${emoteName}\` emote: ${err.message}`));
            }
            return this.respond(`The brugs don't like to add the emote \`${emoteName}\` ${forHead}`);
          });
        })
        .catch(err => this.reply(err));
    }, () => this.reply(`The link doesn't have a valid image that Discord supports ${nam} only jpeg, jpg, gif and png.`));
  }
}

module.exports = VoteEmote;
