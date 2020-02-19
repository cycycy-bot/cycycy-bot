/**
 * Represents a command
 */
class Command {
  /**
   * @param {Cybot}  bot      The client used in the command
   * @param {Object} options  The command's configuration
   */
  constructor(bot, options) {
    /**
     * The client used in the commands
     * @type {Cybot}
     */
    this.bot = bot;

    /**
     * The command's information properties
     * @type {Object}
     */
    this.help = {
      name: options.name || null,
      description: options.description || 'No information specified',
      usage: options.usage || '',
      category: options.category || 'Information',
    };

    /**
     * The command's configuration
     * @type {Object}
     */
    this.conf = {
      permLevel: options.permLevel || 0,
      permission: options.permission || 'SEND_MESSAGES',
      cooldown: options.cooldown || 1000,
      aliases: options.aliases || [],
      allowDMs: options.allowDMs || false,
      ownerOnly: options.ownerOnly || false,
    };

    /**
     * A set of IDs of the users on cooldown
     * @type {Set}
     */
    this.cooldown = new Set();
  }

  /**
   * Puts a user on cooldown
   * @param {String} user The ID of the user to put on cooldown
   */
  startCooldown(user) {
    // Adds user to the set
    this.cooldown.add(user);

    // Removes the user from the set after the cooldown
    setTimeout(() => {
      this.cooldown.delete(user);
    }, this.conf.cooldown);
  }

  /**
   * Checks whether the user has a permission to fire the command
   * @param {Object} message The object of the message that contains the user's permisions in the guild
   */
  hasPermission(message) {
    if (this.ownerOnly && message.author.id === this.bot.owner) return true;
  }

  setMessage(message) {
    this.message = message;
  }

  respond(message) {
    this.message.channel.send(message);
  }
}

module.exports = Command;
