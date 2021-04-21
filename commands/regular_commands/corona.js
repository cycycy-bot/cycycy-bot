const { NovelCovid } = require('novelcovid');
const Discord = require('discord.js');
const Command = require('../../base/Command');

class Corona extends Command {
  constructor(bot) {
    super(bot, {
      name: 'corona',
      description: 'Gives coronavirus information on a specific country or world cases of coronavirus',
      usage: '$corona <country>(optional)',
      cooldown: 1000,
      aliases: ['cv'],
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');

    const track = new NovelCovid();
    const countryName = args.join(' ');


    if (args[0] && args[0].toLowerCase() === 'state') {
      const stateArg = args.slice(1).join(' ');
      return track.states().then((stateArray) => {
        stateArray.forEach((stateData) => {
          if (stateData.state.toLowerCase() === stateArg.toLowerCase()) {
            const {
              cases, deaths, todayCases, todayDeaths, state,
            } = stateData;
            const coronaEmbed = new Discord.MessageEmbed()
              .setTitle(state)
	      .addField('Confirmed Cases:', Number(cases).toLocaleString(), true)
	      .addField('Cases Today:', Number(todayCases).toLocaleString(), true)
	      .addField('Deaths:', Number(deaths).toLocaleString(), true)
	      .addField('Deaths Today:', Number(todayDeaths).toLocaleString(), true);
            return this.respond(coronaEmbed);
          }
        });
      });
    }
    if (!countryName) {
      track.all().then((cInfo) => {
          let { cases, deaths, recovered }  = cInfo;
	  cases = Number(cases).toLocaleString();
	  deaths = Number(deaths).toLocaleString();
	  recovered = Number(recovered).toLocaleString();
        this.reply(`The world has ${cases} confirmed cases, ${deaths} deaths, and ${recovered} recovered cases`);
      });
    } else {
      track.countries(countryName).then((cInfo) => {
        if (cInfo.message) return this.reply(`${cInfo.message} ${nam}`);
        const {
          country, countryInfo: { flag }, cases, todayCases, deaths, todayDeaths, recovered,
        } = cInfo;

        const coronaEmbed = new Discord.MessageEmbed()
          .setTitle(country)
          .setThumbnail(flag)
          .addField('Confirmed Cases:', Number(cases).toLocaleString(), true)
          .addField('Cases Today:', Number(todayCases).toLocaleString(), true)
          .addField('Deaths:', Number(deaths).toLocaleString(), true)
          .addField('Deaths Today:', Number(todayDeaths).toLocaleString(), true)
          .addField('Recovered:', Number(recovered).toLocaleString(), true);
        this.respond(coronaEmbed);
      });
    }
  }
}

module.exports = Corona;
