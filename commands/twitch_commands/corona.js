const { NovelCovid } = require('novelcovid');
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
    const nam = 'NaM';

    const track = new NovelCovid();
    const countryName = args.join(' ');

    if (args[0] && args[0].toLowerCase() === 'state') {
      const stateArg = args.slice(1).join(' ');
      return track.states().then((stateArray) => {
        stateArray.forEach((stateData) => {
            if (stateData.state.toLowerCase() === stateArg.toLowerCase()) {
		let {
		    cases, deaths, todayCases, todayDeaths, state,
		} = stateData;
		cases = Number(cases).toLocaleString();
		deaths = Number(deaths).toLocaleString();
		recovered = Number(recovered).toLocaleString();
		todayCases = Number(todayCases).toLocaleString();g
            const coronaStringResult = `${state}'s Corona Virus Information: ${cases} Confirmed Cases, ${deaths} Deaths, ${todayCases} Cases Today, ${todayDeaths} Deaths Today`;
            return this.bot.me(message.channelName, coronaStringResult);
          }
        });
      });
    }
    if (!countryName) {
      track.all().then((cInfo) => {
          let { cases, deaths, recovered } = cInfo;
	  cases = Number(cases).toLocaleString();
	  deaths = Number(deaths).toLocaleString();
	  recovered = Number(recovered).toLocaleString();
        this.this.bot.say(message.channelName, `The world has ${cases} confirmed cases, ${deaths} deaths, and ${recovered} recovered cases`);
      });
    } else {
      track.countries(countryName).then((cInfo) => {
        if (cInfo.message) return this.bot.me(message.channelName, `${cInfo.message} ${nam}`);
          let {
              country, cases, deaths, recovered,
          } = cInfo;
	  cases = Number(cases).toLocaleString();
	  deaths = Number(deaths).toLocaleString();
	  recovered = Number(recovered).toLocaleString();
        const coronaStringResult = `${country} has a total of ${cases} Confirmed Cases, ${deaths} Deaths and ${recovered} Recovered`;
        this.bot.me(message.channelName, coronaStringResult);
      });
    }
  }
}

module.exports = Corona;
