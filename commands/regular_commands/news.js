const Discord = require('discord.js');
const NewsAPI = require('newsapi');

const newsapi = new NewsAPI(process.env.NEWS_KEY);

module.exports.run = async (bot, message, args, NaM, OMGScoots) => {
  if (args[0] === 'help') {
    const help = new Discord.RichEmbed()
      .setAuthor('News Help Menu', bot.user.displayAvatarURL)
      .setDescription(`**Note:** Atleast one of the parameters **\`country\`**,**\`category\`**, **\`sources\`**, and **\`search\`** are required(**\`res\`** parameter will give you the number of results and defaults to 1, max results is 3). \n The **\`sources\`** parameter can't be combined with **\`country\`** or **\`category\`** parameter. \n **Country codes, sources, and categories can be found here** [https://newsapi.org/sources](https://newsapi.org/sources) ${NaM}`)
      .addBlankField()
      .addField('(IMPORTANT) Second parameter', '$news **top**', true)
      .addField('Definition', '`top` = top headlines')
      .addBlankField()
      .addField(`Category Options ${OMGScoots}`, 'business, entertainment, general, health, science, sports, technology')
      .addField('Usage', '$news **top** `country` us `category` sports', true)
      .addField('Result', 'Returns the `top headlines` for `sports` in `USA`')
      .setFooter('Need more help? Ask cycycy, my pepega creator');

    return message
      .channel
      .send(help);
  }

  if (!args[0] === 'top' || !args[0] === 'publishers' || !args[0]) {
    message
      .channel
      .send(`Please add \`top\` as the second parameter ${NaM}`);
    return message
      .channel
      .send('Example: `$news top country us`');
  }

  const country = args.includes('country');
  const category = args.includes('category');
  const sources = args.includes('sources');
  const search = args.includes('search');
  const result = args.includes('result');

  if (sources && (country || category)) {
    return message.reply(`Sorry I can't add \`sources\` params with \`country\`, \`category\` or \`search\` params ${NaM}`);
  }

  if (args[0] === 'top') {
    if (result && args[(args.indexOf('result') + 1)] > 3) {
      return message
        .channel
        .send(`\`result\` parameter must be less than 3 ${NaM}`);
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
          return message
            .channel
            .send(`No results found ${NaM}`);
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

          const articleEmbed = new Discord.RichEmbed()
            .setTitle(title)
            .setURL(url)
            .setDescription(description)
            .setImage(urlToImage)
            .addField('Publisher', name, true)
            .addField('Published At', publishedAt, true)
            .addField('Author', author, true)
            .setFooter('Powered by News API', 'https://newsapi.org/images/n-logo-border.png')
            .setColor('#95ff4f');

          return message
            .channel
            .send(articleEmbed);
        });
      })
      .catch((err) => {
        message.reply(`\`${err}\``);
      });
  }
};

module.exports.help = {
  name: 'news',
};
