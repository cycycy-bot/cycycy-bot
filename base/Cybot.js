const { Client, Collection } = require('discord.js');
const chalk = require('chalk');
const { readdir } = require('fs');
const { version } = require('../package.json');


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

    /**
     * Collection of users in cookie command cooldown
     * @type {Discord.Collection}
     */
    this.cookieCD = new Collection();

    // Bot variables

    /**
     * The bot's configuration
     * @type {Object}
     */
    this.config = options.config ? require(`${options.config}`) : {};

    /**
     * Mongoose dependency
     * @type {Object}
     */
    this.db = require('../settings/databaseImport');

    /**
     * Fetch Module
     * @type {Object}
     */
    this.fetch = require('node-fetch');
  }

  /**
   * Loads all commands in the directory specified
   * @param {String} path The path where the commands are located
   */
  loadCommands(path) {
    // read regular commands
    readdir(`${path}/regular_commands/`, (err, files) => {
      if (err) console.error(`${chalk.red('Error:')} ${err}`);

      const jsfile = files.filter(f => f.split('.').pop() === 'js');
      if (jsfile.length <= 0) {
        console.error(chalk.red('Couldn\'t find commands.'));
        return;
      }

      jsfile.forEach((f) => {
        const props = new (require(`../${path}/regular_commands/${f}`))(this);
        console.info(`${chalk.green('Command loaded!:')} ${f}`);
        this.commands.set(props.help.name, props);
        props.conf.aliases.forEach(a => this.aliases.set(a, props.help.name));
      });
    });
    // read mod commands
    readdir(`${path}/mod_commands/`, (err, files) => {
      if (err) console.error(chalk.red(err));

      const jsfile = files.filter(f => f.split('.').pop() === 'js');
      if (jsfile.length <= 0) {
        console.error(chalk.red('Couldn\'t find commands.'));
        return;
      }

      jsfile.forEach((f) => {
        const props = new (require(`../${path}/mod_commands/${f}`))(this);
        console.info(chalk.green(`Command: ${f} loaded!`));
        this.commands.set(props.help.name, props);
        props.conf.aliases.forEach(a => this.aliases.set(a, props.help.name));
      });
    });
    // // read admin commands
    readdir(`${path}/admin_commands/`, (err, files) => {
      if (err) console.error(chalk.red(err));

      const jsfile = files.filter(f => f.split('.').pop() === 'js');
      if (jsfile.length <= 0) {
        console.error(chalk.red('Couldn\'t find commands.'));
        return;
      }

      jsfile.forEach((f) => {
        const props = new (require(`../${path}/admin_commands/${f}`))(this);
        console.info(chalk.green(`Command: ${f} loaded!`));
        this.commands.set(props.help.name, props);
        props.conf.aliases.forEach(a => this.aliases.set(a, props.help.name));
      });
    });
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
        console.info(`${chalk.green('Event loaded!:')} ${eventName}`);
        super.on(eventName, (...args) => eventHandler(this, ...args));
      });
    });
  }

  /**
   * Initiates mongoDB connection
   * @param {String} dbPass The connection string for mongoDB
   */
  loadDb(dbPass) {
    this.db.mongoose.connect(dbPass,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

    this.db.mongoose.connection.on('connected', () => {
      console.log(`${chalk.green('MongoDB Connected!')}`);
    });

    this.db.mongoose.connection.on('error', (err) => {
      console.error(`${chalk.red(err)}`);
    });

    this.db.mongoose.connection.on('disconnected', () => {
      console.info(`${chalk.yellow('Mongoose default connection is disconnected')}`);
    });
  }

  /**
   * Logs the client in
   * @param {String} token The token used to login for bot
   */
  login(token) {
    // call Discord.Client's login method passing in the token
    super.login(token)
      .then(() => {
        // Client initialization info
        const nodeVersion = process.versions.node.split('.')[0];
        if (nodeVersion < 10) {
          console.warn(`${chalk.yellow('[WARNING]')} cybot v${version} initialized. You are using NodeJS ${process.version}. Version 10+ or latest stable release of NodeJS is advised to be used`);
        } else {
          console.info(`${chalk.green(`cybot v${version} initialized`)} You are using NodeJS ${process.version}`);
        }
      })
      .catch(err => console.error(`${chalk.red(err)}`));

    // Returning the client to allow chaning of function calls
    return this;
  }


  async init() {
    this.on('disconnect', () => console.warn(`${chalk.yellow('Bot is disconnecting...')}`))
      .on('reconnecting', () => console.log(`${chalk.green('Bot reconnecting...')}`))
      .on('error', e => console.error(chalk.red(e))
        .on('warn', info => console.warn(chalk.yellow(info))));

    // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
    process.on('uncaughtException', (err) => {
      const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
      console.error(`${chalk.red('Uncaught Promise Error: ')} ${errorMsg}`);
      process.exit(1);
    });

    process.on('unhandledRejection', (err) => {
      console.error(`${chalk.red('Uncaught Promise Error: ')} ${err}`);
    });

    // close db connection on closed process
    process.on('SIGINT', () => {
      this.db.mongoose.connection.close(() => {
        console.info(`${chalk.yellow('Mongoose default connection is disconnected due to application termination')}`);
        process.exit(0);
      });
    });

    this.loadCommands('./commands');
    this.loadEvents('./handlers');
    this.loadDb(process.env.DB_PASS);
    this.login(process.env.BOT_TOKEN);
  }
}

module.exports = Cybot;
