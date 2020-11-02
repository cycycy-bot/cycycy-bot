const Discord = require('discord.js');
const wiki = require('wikijs').default;
const Command = require('../../base/Command');

class Wiki extends Command {
  constructor(bot) {
    super(bot, {
      name: 'wiki',
      description: 'Shows a wiki summary',
      usage: '$wiki <word> or $wiki search <word>',
      cooldown: 1000,
      aliases: ['wk'],
    });
  }

  async run(message, args) {
    if (args[0] === 'search') {
      const pepeLaugh = this.bot.emojis.cache.find(emoji => emoji.name === 'pepeLaugh');
      const query = args.slice(1).join(' ');
      return wiki()
        .search(query)
        .then((data) => {
          const dataLimit = data.results.slice(0, 14);
          if (data.results.length >= 1) {
            const wikiEmbed = new Discord.MessageEmbed()
              .setAuthor(message.author.username, message.author.displayAvatarURL())
              .addField('Results', dataLimit.join(' \n'))
              .setColor('#db6c42')
              .setFooter('Select an article by typing one of the results in your next message');

            this.respond(wikiEmbed);

            const filter = m => m.author.id === message.author.id;
            message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
              .then(collected => collected.map(collects => collects.content))
              .then((collects) => {
                const selected = collects[0];
                const { results } = data;

                results.forEach((result) => {
                  if (result === selected) {
                    return wiki().page(selected)
                      .then((page) => {
                        const resultsEmbed = new Discord.MessageEmbed();
                        page.summary()
                          .then((pRes) => {
                            page.mainImage()
                              .then(img => resultsEmbed.setImage(img))
                              .then(() => {
                                const toSend = pRes.substring(0, 2000);
                                resultsEmbed.setURL(page.raw.fullurl);
                                resultsEmbed.setTitle(`Wiki about ${selected}`);
                                resultsEmbed.setColor('#db6c42');
                                resultsEmbed.setDescription(toSend);
                                this.respond(resultsEmbed);
                              }).catch(err => this.reply(`Error ${err}`));
                          }).catch(err => this.reply(`Error ${err}`));
                      }).catch(err => this.reply(`Error ${err}`));
                  }
                });
              })
              .catch(test => console.log(`err ${test}`));
          } else {
            return this.respond(`No article found ${pepeLaugh}`);
          }
        })
        .catch(err => this.respond(`Error: ${err}`));
    }


    const joinedArgs = args.join(' ');
    wiki().page(joinedArgs)
      .then((page) => {
        const resultsEmbed = new Discord.MessageEmbed();
        page.summary()
          .then((results) => {
            page.mainImage()
              .then(img => resultsEmbed.setImage(img))
              .then(() => {
                const toSend = results.substring(0, 2000);
                resultsEmbed.setTitle(`Wiki about ${joinedArgs}`);
                resultsEmbed.setURL(page.raw.fullurl);
                resultsEmbed.setColor('#db6c42');
                resultsEmbed.setDescription(toSend);
                this.respond(resultsEmbed);
              }).catch(err => this.reply(`Error ${err}`));
          }).catch(err => this.reply(`Error ${err}`));
      }).catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = Wiki;
