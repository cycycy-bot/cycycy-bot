const Command = require('../../base/Command');

class Ping extends Command {
  constructor(bot) {
    super(bot, {
      name: 'ping',
      description: 'Pings the bot.',
      usage: '',
      cooldown: 5000,
      permission: 'MODERATOR',
    });
  }

  /**
   * Runs the command
   * @param {Object} message The message object
   */
  run(bot, message) {
    super.respond(`Pong! Took ${Date.now() - message.createdAt}ms.`);
  }
}

module.exports = Ping;
