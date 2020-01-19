const Discord = require('discord.js');
const wiki = require('wikijs').default;

module.exports.run = async (bot, message, args) => {
  if (args[0] === 'help') {
    message
      .channel
      .send('```Usage: $wiki <wiki search> or $wiki search <query>```');
    return;
  }
  bot.cooldown.add(message.author.id);
  setTimeout(() => {
    bot.cooldown.delete(message.author.id);
  }, 15000);

  if (args[0] === 'search') {
    const pepeLaugh = bot.emojis.find(emoji => emoji.name === 'pepeLaugh');
    const query = args.slice(1).join(' ');
    return wiki()
      .search(query)
      .then((data) => {
        const dataLimit = data.results.slice(0, 14);
        if (data.results.length >= 1) {
          const wikiEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL)
            .addField('Results', dataLimit.join(' \n'))
            .setColor('#db6c42')
            .setFooter('Select an article by typing one of the results in your next message');

          message.channel.send(wikiEmbed);

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
                      const resultsEmbed = new Discord.RichEmbed();
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
                              message.channel.send(resultsEmbed);
                            }).catch(err => message.reply(`Error ${err}`));
                        }).catch(err => message.reply(`Error ${err}`));
                    }).catch(err => message.reply(`Error ${err}`));
                }
              });
            })
            .catch(test => console.log(`err ${test}`));
        } else {
          return message.channel.send(`No article found ${pepeLaugh}`);
        }
      })
      .catch(err => message.channel.send(`Error: ${err}`));
  }


  const joinedArgs = args.join(' ');
  wiki().page(joinedArgs)
    .then((page) => {
      const resultsEmbed = new Discord.RichEmbed();
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
              message.channel.send(resultsEmbed);
            }).catch(err => message.reply(`Error ${err}`));
        }).catch(err => message.reply(`Error ${err}`));
    }).catch(err => message.reply(`Error ${err}`));
};

module.exports.help = {
  name: 'wiki',
};
