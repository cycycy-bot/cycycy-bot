const Discord = require('discord.js');
const Command = require('../../base/Command');

class Thesaurus extends Command {
  constructor(bot) {
    super(bot, {
      name: 'thesaurus',
      description: 'Gives a thesaurus of a word',
      usage: '$thesaurus <word>',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const word = args.join(' ');

    this.bot.fetch(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${process.env.DICTIONARY_KEY}`)
      .then(res => res.json())
      .then((definition) => {
        if (!definition || !definition[0].meta) {
          const wordEmbed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Can\'t find the word you are looking for')
            .setThumbnail('https://www.flaticon.com/premium-icon/icons/svg/78/78924.svg')
            .addField('Did you mean these words?', definition.join(', '))
            .setFooter('Powered by Merriam Webster API', 'https://www.merriam-webster.com/assets/mw/static/app-standalone-images/MW_logo.png');
          return this.respond(wordEmbed);
        }
        definition.forEach(async (defs) => {
          const functionalLabel = defs.fl;
          const wordDef = defs.shortdef;
          const example = defs.def[0].sseq[0][0][1].dt[1][1][0].t;
          // join args
          const joinedSyns = defs.meta.syns[0] ? defs.meta.syns[0].join(', ') : null;

          const wordEmbed = new Discord.MessageEmbed()
            .setColor('#004bc4')
            .setTitle(`Word: ${word.charAt(0).toUpperCase()}${word.slice(1)}`)
            .addField('Synonyms: ', joinedSyns)
            .addField('Functional Label: ', functionalLabel)
            .addField('Definition: ', wordDef)
            .addField('Example: ', `\`\`\`${example}\`\`\``)
            .setFooter('Powered by Merriam Webster API', 'https://www.merriam-webster.com/assets/mw/static/app-standalone-images/MW_logo.png');
          await this.respond(wordEmbed);
        });
      }).catch(err => this.respond(`Error ${err}`));
  }
}

module.exports = Thesaurus;
