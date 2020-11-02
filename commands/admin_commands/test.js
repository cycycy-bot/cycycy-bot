const Command = require('../../base/Command');

class Test extends Command {
  constructor(bot) {
    super(bot, {
      name: 'test',
      description: 'Test if the bot is responding',
      usage: '$test',
      permission: 'ADMINISTRATOR',
      cooldown: 1000,
      category: 'admin',
    });
  }

  async run(message, args) {
    const pepegaPls = this.bot.emojis.cache.find(emoji => emoji.name === 'PepegaPls');

    return this.respond(`RUNNING ${pepegaPls}`);
  }
}

module.exports = Test;
