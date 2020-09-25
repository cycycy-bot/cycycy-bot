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
      category: options.category || 'regular',
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
   * Checks whether the user has a discord permission to fire the command
   * @function
   */
  async hasPermission() {
    if (this.message.author.id === this.bot.config.owner) return true;
    if (this.conf.ownerOnly && this.message.author.id !== this.bot.config.owner) return false;
    if (this.conf.permission === 'SEND_MESSAGES') return true;
    if (this.conf.permission === 'ADMINISTRATOR' && this.message.member.hasPermission('ADMINISTRATOR')) return true;
    if (this.conf.permission === 'ADMINISTRATOR' && !this.message.member.hasPermission('ADMINISTRATOR')) return false;
    return this.bot.db.Mod.findOne({ serverID: this.message.guild.id }).then((res) => {
      if (this.conf.permission === 'MODERATOR' && res) {
        const serverRole = this.message.guild.roles.get(res.modName);
        if ((res.modName === serverRole.id && this.message.member.roles.has(serverRole.id)) || this.message.member.hasPermission('ADMINISTRATOR')) return true;
      }
      if (!res) return;
      return false;
    });
  }

  /**
   * Checks whether the user has a twitch permission to fire the command
   * @function
   */
  async hasTwitchPermission() {
    if (this.bot.config.twitchowner === this.message.senderUserID) return true;
    if (this.conf.permission === 'mod' && this.message.isMod) return true;
    if (this.conf.permission === 'SEND_MESSAGES') return true;
    return false;
  }

  /**
   * Sets the message object to this.message
   * @param {Object} message The message object passed
   */
  setMessage(message) {
    this.message = message;
  }

  /**
   * Response to the command
   * @param {String} message The message string in response to the command
   * @param {Object} options The message options
   */
  respond(message, options) {
    return this.message.channel.send(message, options);
  }

  /**
   * Replies to the user who sent the command
   * @param {String} message The message string in response to the command
   * @param {Object} options The message options
   */
  reply(message, options) {
    this.message.reply(message, options);
  }

  /**
   * Replies to the user in DMs
   * @param {String} message The message string in response to the command
   * @param {Object} options The message options
   */
  dm(message, options) {
    this.message.author.send(message, options);
  }
}

module.exports = Command;
