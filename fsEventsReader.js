const fs = require('fs');

module.exports = (bot) => {
  fs.readdir('./handlers/', (err, files) => {
    if (err) return console.error(err);

    // ignores files starting with underscore
    const jsFile = files.filter(f => !(/_/g).test(f));

    jsFile.forEach((file) => {
      const eventHandler = require(`./handlers/${file}`);
      const eventName = file.split('.')[0];
      console.log(`Event: ${eventName} loaded!`);
      bot.on(eventName, (...args) => eventHandler(bot, ...args));
    });
  });
};
