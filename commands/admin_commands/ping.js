const Command = require('../../base/Command');

class Ping extends Command {
  constructor(bot) {
    super(bot, {
      name: 'ping',
      description: 'Pings the bot',
      usage: '$ping',
      permission: 'ADMINISTRATOR',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const KEKW = this.bot.emojis.find(emoji => emoji.name === 'KEKW');

    return this.respond(`PINGING ${KEKW} took ${Math.round(this.bot.ping)}ms`);
  }
}

module.exports = Ping;
