const Command = require('../../base/Command');

class Ping extends Command {
  constructor(bot) {
    super(bot, {
      name: 'ping',
      description: 'Pings the bot.',
      usage: '',
    });
  }
}

module.exports = Ping;
