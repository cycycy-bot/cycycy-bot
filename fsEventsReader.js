const fs = require('fs');

module.exports = (bot) => {
  fs.readdir('./handlers/', (err, files) => {
    if (err) return console.error(err);

    const jsfile = files.filter(f => f.split('.').pop() === 'js');
    if (jsfile.length <= 0) {
      console.log('Couldn\'t find events.');
      return;
    }

    jsfile.forEach((f) => {
      const event = require(`./handlers/${f}`);
      console.log(`${f} loaded!`);
      bot.on(f, (...args) => event(bot, ...args));
    });
  });
};