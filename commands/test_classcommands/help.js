const Commands = require('../../base/Command');

class Help extends Commands {
  constructor(bot) {
    super(bot, {
      name: 'help',
      description: 'Displays a list of available commands with description',
      usage: '$help',
      aliases: ['h'],
      cooldown: 0,
    });
  }

  async run(message, args) {
    const regularCommands = [];
    const modCommands = [];
    const adminCommands = [];

    await this.bot.commands.forEach((c) => {
      const { category } = c.help;

      if (category === 'regular') {
        regularCommands.push(c.help);
      } else if (category === 'mod') {
        modCommands.push(c.help);
      } else {
        adminCommands.push(c.help);
      }
    });
    console.log(regularCommands);
  }
}

module.exports = Help;
