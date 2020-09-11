const Command = require('../../base/Command');

class Weather extends Command {
  constructor(bot) {
    super(bot, {
      name: 'weather',
      description: 'Shows current weather in specified city',
      usage: '$weather <city>',
      cooldown: 1000,
      aliases: ['w'],
    });
  }

  async run(message, args) {
    const nam = 'NaM';

    const joinedArgs = args.join(' ');

    this.bot.fetch(`https://api.openweathermap.org/data/2.5/weather?q=${joinedArgs}&units=metric&appid=8d1a465793567f602b025c310a5d8c13`, {
      method: 'get',
      headers: { 'content-type': 'application/json' },
    })
      .then(res => res.json())
      .then((weather) => {
        if (weather.cod === '404') return this.bot.say(message.channelName, `City not found ${nam}`);
        const {
          name, sys: { country }, main: { temp, humidity }, wind: { speed },
        } = weather;

        const weatherDesc = weather.weather[0].description;
        const weatherDescCapitalized = weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1);
        const weatherString = `Weather Forecast for ${name}, ${country} (${weatherDescCapitalized}): Temperature ${temp}°C, Humidity: ${humidity}%, Wind Speed: ${speed}m/s`;
        return this.bot.say(message.channelName, weatherString);
      });
  }
}

module.exports = Weather;
