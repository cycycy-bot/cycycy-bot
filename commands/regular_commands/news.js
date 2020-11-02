const Discord = require('discord.js');
const NewsAPI = require('newsapi');
const Command = require('../../base/Command');

const newsapi = new NewsAPI(process.env.NEWS_KEY);

class News extends Command {
  constructor(bot) {
    super(bot, {
      name: 'news',
      description: 'Gives top news in country specified',
      usage: '$news `top` `country` <country> `category`(optional) <category> \n Example: $news top country us \n Example: $news top country us category sports \n For more info use $news help',
      aliases: ['n'],
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');
    const omgScoots = '<:OMGScoots:669029552495788082>';

    if (args[0] === 'help') {
      const help = new Discord.MessageEmbed()
        .setAuthor('News Help Menu', this.bot.user.displayAvatarURL())
        .setDescription(`**Note:** Atleast one of the parameters **\`country\`**,**\`category\`**, **\`sources\`**, and **\`search\`** are required(**\`res\`** parameter will give you the number of results and defaults to 1, max results is 3). \n The **\`sources\`** parameter can't be combined with **\`country\`** or **\`category\`** parameter. \n **Country codes, sources, and categories can be found here** [https://newsapi.org/sources](https://newsapi.org/sources) ${NaM}`)
        .addBlankField()
        .addField('(IMPORTANT) Second parameter', '$news **top**', true)
        .addField('Definition', '`top` = top headlines')
        .addBlankField()
        .addField(`Category Options ${omgScoots}`, 'business, entertainment, general, health, science, sports, technology')
        .addField('Usage', '$news **top** `country` us `category` sports', true)
        .addField('Result', 'Returns the `top headlines` for `sports` in `USA`')
        .setFooter('Need more help? Ask cycycy, my pepega creator');

      return this.respond(help);
    }

    if (!args[0] === 'top' || !args[0] === 'publishers' || !args[0]) {
      this.respond(`Please add \`top\` as the second parameter ${nam}`);
      return this.respond('Example: `$news top country us`');
    }

    const country = args.includes('country');
    const category = args.includes('category');
    const sources = args.includes('sources');
    const search = args.includes('search');
    const result = args.includes('result');

    if (sources && (country || category)) {
      return this.reply(`Sorry I can't add \`sources\` params with \`country\`, \`category\` or \`search\` params ${nam}`);
    }

    if (args[0] === 'top') {
      if (result && args[(args.indexOf('result') + 1)] > 3) {
        return this.respond(`\`result\` parameter must be less than 3 ${nam}`);
      }
      return newsapi.v2.topHeadlines({
        sources: sources ? args[(args.indexOf('sources') + 1)] : null,
        q: search ? args[(args.indexOf('search') + 1)] : null,
        category: category ? args[(args.indexOf('category') + 1)] : null,
        country: country ? args[(args.indexOf('country') + 1)] : null,
        pageSize: result ? args[(args.indexOf('result') + 1)] : 1,
      })
        .then((res) => {
          if (res.articles.length <= 0) {
            return this.respond(`No results found ${nam}`);
          }
          res.articles.map((article) => {
            const {
              source:
            {
              name,
            },
              author,
              title,
              description,
              url,
              urlToImage,
              publishedAt,
            } = article;

            const articleEmbed = new Discord.MessageEmbed()
              .setTitle(title)
              .setURL(url)
              .setDescription(description)
              .setImage(urlToImage)
              .addField('Publisher', name, true)
              .addField('Published At', publishedAt, true)
              .addField('Author', author, true)
              .setFooter('Powered by News API', 'https://newsapi.org/images/n-logo-border.png')
              .setColor('#95ff4f');

            return this.respond(articleEmbed);
          });
        })
        .catch((err) => {
          this.reply(`\`${err}\``);
        });
    }
  }
}

module.exports = News;
