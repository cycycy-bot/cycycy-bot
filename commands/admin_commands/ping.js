const Command = require('../../base/Command');

class Ping extends Command {
  constructor(bot) {
    super(bot, {
      name: 'ping',
      description: 'Pings the bot',
      usage: '$ping',
      permission: 'ADMINISTRATOR',
      cooldown: 1000,
      category: 'admin',
    });
  }

  async run(message, args) {
    const forHead = this.bot.emojis.cache.find(emoji => emoji.name === '4HEad');

    return this.respond(`PINGING ${forHead} took ${Math.round(this.bot.ws.ping)}ms`);
  }
}

module.exports = Ping;
