const Discord = require('discord.js');
const fetch = require('node-fetch');
const path = require('path');
const getColors = require('get-image-colors');

module.exports.run = async (bot, message, args, NaM) => {
  const joinedArgs = args.join(' ');

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${joinedArgs}&units=metric&appid=8d1a465793567f602b025c310a5d8c13`, {
    method: 'get',
    headers: { 'content-type': 'application/json' },
  })
    .then(res => res.json())
    .then((weather) => {
      if (weather.cod === '404') return message.reply(`City not found ${NaM}`);
      const {
        name, sys: { country }, main: { temp, humidity }, clouds: { all }, wind: { speed },
      } = weather;

      return getColors(path.join(__dirname, `./weatherimg/${weather.weather[0].icon}@2x.png`))
        .then((colors) => {
          const weatherDesc = weather.weather[0].description;
          const weatherDescCapitalized = weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1);

          const weatherEmbed = new Discord.RichEmbed()
            .setAuthor(`Live Weather Forecast for ${name}, ${country}`)
            .setThumbnail(`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`)
            .setTitle('Weather')
            .setDescription(weatherDescCapitalized)
            .addField('Temperature', `${temp}°C`, true)
            .addField('Humidity', `${humidity}%`, true)
            .addField('Wind Speed', `${speed}m/s`, true)
            .addField('Cloudiness', `${all}%`, true)
            .setColor(colors[0].hex())
            .setFooter('Powered by openweather API');
          return message.channel.send(weatherEmbed);
        })
        .catch(err => message.reply(`\`${err}\``));
    });
};

module.exports.help = {
  name: 'weather',
};
