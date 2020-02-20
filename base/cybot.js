const { Client, Collection } = require('discord.js');
const chalk = require('chalk');
const { readdir } = require('fs');


/**
 * Represents a Discord client
 * @extends Discord.Client
 */
class Cybot extends Client {
  /**
   * @param {Object} options               The options passed to the client
   * @param {Object} options.clientOptions The client options used by the original discord.js client
   * @param {Object} options.config        The filepath to the config file
   * @param {Object} options.perms         The permission levels file
   */
  constructor(options) {
    super(options.clientOptions || {});

    /**
     * Collection of commands
     * @type {Discord.Collection}
     */
    this.commands = new Collection();

    /**
     * Collection of command aliases
     * @type {Discord.Collection}
     */
    this.aliases = new Collection();

    // Bot variables

    /**
     * The bot's configuration
     * @type {Object}
     */
    this.config = options.config ? require(`${options.config}`) : {};

    /**
     * The bot's permission levels
     * @type {Object}
     */

    // Client initialization info
    const nodeVersion = process.versions.node.split('.')[0];
    if (nodeVersion < 12) {
      console.warn(chalk.yellow(`[WARNING] cybot initialized. You are using NodeJS ${process.version}. Versions 12+ are advised to be used.`));
    } else {
      console.info(chalk.green(`cybot initialized. You are using NodeJS ${process.version}.`));
    }
  }

  /**
   * Logs the client in
   * @param {String} token The token used to login for bot
   */
  login(token) {
    // call Discord.Client's login method passing in the token
    super.login(token);

    // Returning the client to allow chaning of function calls
    return this;
  }

  /**
   * Loads all commands in the directory specified
   * @param {String} path The path where the commands are located
   */
  loadCommands(path) {
    // read regular commands
    readdir(`${path}/test_classcommands/`, (err, files) => {
      if (err) console.error(chalk.red(err));

      const jsfile = files.filter(f => f.split('.').pop() === 'js');
      if (jsfile.length <= 0) {
        console.error(chalk.red('Couldn\'t find commands.'));
        return;
      }

      jsfile.forEach((f) => {
        const props = new (require(`../${path}/test_classcommands/${f}`))(this);
        console.info(chalk.green(`Command: ${f} loaded!`));
        this.commands.set(props.help.name, props);
      });
    });
    // read mod commands
    // readdir(`${path}/mod_commands/`, (err, files) => {
    //   if (err) console.error(chalk.red(err));

    //   const jsfile = files.filter(f => f.split('.').pop() === 'js');
    //   if (jsfile.length <= 0) {
    //     console.error(chalk.red('Couldn\'t find commands.'));
    //     return;
    //   }

    //   jsfile.forEach((f) => {
    //     const props = require(`../${path}/mod_commands/${f}`);
    //     console.info(chalk.green(`Command: ${f} loaded!`));
    //     this.commands.set(props.help.name, props);
    //   });
    // });
    // // read admin commands
    // readdir(`${path}/admin_commands/`, (err, files) => {
    //   if (err) console.error(chalk.red(err));

    //   const jsfile = files.filter(f => f.split('.').pop() === 'js');
    //   if (jsfile.length <= 0) {
    //     console.error(chalk.red('Couldn\'t find commands.'));
    //     return;
    //   }

    //   jsfile.forEach((f) => {
    //     const props = require(`../${path}/admin_commands/${f}`);
    //     console.info(chalk.green(`Command: ${f} loaded!`));
    //     this.commands.set(props.help.name, props);
    //   });
    // });
  }

  /**
   * Loads all events in the directory specified
   * @param {String} path The path where the events are located
   */
  loadEvents(path) {
    readdir(`${path}`, (err, files) => {
      if (err) console.error(chalk.red(err));

      // ignores files starting with underscore
      const jsFile = files.filter(f => !(/_/g).test(f));

      jsFile.forEach((file) => {
        const eventHandler = require(`../${path}/${file}`);
        const eventName = file.split('.')[0];
        console.info(chalk.green(`Event: ${eventName} loaded!`));
        super.on(eventName, (...args) => eventHandler(this, ...args));
      });
    });
  }
}

module.exports = Cybot;
