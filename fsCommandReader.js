const fs = require('fs');

module.exports = (bot) => {
  // READ REGULAR COMMANDS
  fs.readdir('./commands/regular_commands/', (err, files) => {
    if (err) console.log(err);

    const jsfile = files.filter(f => f.split('.').pop() === 'js');
    if (jsfile.length <= 0) {
      console.log('Couldn\'t find commands.');
      return;
    }

    jsfile.forEach((f) => {
      const props = require(`./commands/regular_commands/${f}`);
      console.log(`${f} loaded!`);
      bot.commands.set(props.help.name, props);
    });
  });

  // READ MOD COMMANDS
  fs.readdir('./commands/mod_commands/', (err, files) => {
    if (err) console.log(err);

    const jsfile = files.filter(f => f.split('.').pop() === 'js');
    if (jsfile.length <= 0) {
      console.log('Couldn\'t find commands.');
      return;
    }

    jsfile.forEach((f) => {
      const props = require(`./commands/mod_commands/${f}`);
      console.log(`${f} loaded!`);
      bot.commands.set(props.help.name, props);
    });
  });

  // READ ADMIN COMMANDS
  fs.readdir('./commands/admin_commands/', (err, files) => {
    if (err) console.log(err);

    const jsfile = files.filter(f => f.split('.').pop() === 'js');
    if (jsfile.length <= 0) {
      console.log('Couldn\'t find commands.');
      return;
    }

    jsfile.forEach((f) => {
      const props = require(`./commands/admin_commands/${f}`);
      console.log(`${f} loaded!`);
      bot.commands.set(props.help.name, props);
    });
  });
};
