const { ChatClient } = require('dank-twitch-irc');
const chalk = require('chalk');
const { readdir } = require('fs');
const WebSocket = require('ws');

/**
 * Represents a Twitch client
 * @extends ChatClient
 */
class TwitchClient extends ChatClient {
  /**
   * @param {Object} options The client options used by dank-twitch-irc
   */
  constructor(options) {
    super(options || {});

    /**
     * A set of IDs of the users on cooldown
     * @type {Set}
     */
    this.cooldown = new Set();

    /**
     * Collection of commands
     * @type {Set}
     */
    this.commands = new Map();

    /**
     * Collection of command aliases
     * @type {Set}
     */
    this.aliases = new Map();

    /**
     * The bot's configuration
     * @type {Object}
     */
    this.config = options.config ? require(`${options.config}`) : {};

    /**
     * Websocket connection
     * @type {Function}
     */
    this.ws = new WebSocket('ws://localhost:8080');

    /**
     * Array of the channel's FFZ emotes
     * @type {Array}
     */
    this.ffz = null;

    /**
     * Array of the FFZ global emotes
     * @type {Array}
     */
    this.ffzGlobal = null;

    /**
     * Array of the bttv emotes
     * @type {Array}
     */
    this.bttv = null;
  }

  /**
   * Loads all commands in the directory specified
   * @param {String} path The path where the commands are located
   */
  loadCommands(path) {
    // read regular commands
    readdir(`${path}/twitch_commands/`, (err, files) => {
      if (err) console.error(`${chalk.red('Error:')} ${err}`);

      const jsfile = files.filter(f => f.split('.').pop() === 'js');
      if (jsfile.length <= 0) {
        console.error(chalk.red('Couldn\'t find commands.'));
        return;
      }

      jsfile.forEach((f) => {
        const props = new (require(`../${path}/twitch_commands/${f}`))(this);
        console.info(`${chalk.green('Twitch Command loaded!:')} ${f}`);
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
   * Loads all FFZ channel emotes
   */
  async fetchFFZ() {
    const baseURL = 'https://api.frankerfacez.com/v1/room';
    const response = await cb.fetch(`${baseURL}/cycycy`, {
      method: 'get',
      headers: { 'content-type': 'application/json' },
    });
    const json = await response.json();
    const { emoticons } = json.sets['259311'];
    return this.ffz = emoticons;
  }

  /**
   * Loads all FFZ global emotes
   */
  async fetchFFZGlobal() {
    const baseURL = 'https://api.frankerfacez.com/v1/set/global';
    const response = await cb.fetch(`${baseURL}`, {
      method: 'get',
      headers: { 'content-type': 'application/json' },
    });
    const json = await response.json();
    const { emoticons } = json.sets['3'];
    const emoticons1 = json.sets['4330'].emoticons;

    const concatenated = emoticons.concat(emoticons1);
    return this.ffzGlobal = concatenated;
  }

  /**
   * Loads all bttv channel & global emotes
   */
  async fetchBTTV() {
    const channelbaseURL = 'https://api.betterttv.net/2/channels/cycycy';
    const globalbaseURL = 'https://api.betterttv.net/2/emotes';
    const response = await cb.fetch(`${channelbaseURL}`, {
      method: 'get',
      headers: { 'content-type': 'application/json' },
    });
    const json1 = await response.json();
    const channelEmotes = json1.emotes;

    const response2 = await cb.fetch(`${globalbaseURL}`, {
      method: 'get',
      headers: { 'content-type': 'application/json' },
    });
    const json2 = await response2.json();
    const globalEmotes = json2.emotes;

    const concatenated = channelEmotes.concat(globalEmotes);
    return this.bttv = concatenated;
  }

  /**
   * Initiatilzes events
   */
  init() {
    this.loadCommands('./commands');
    this.loadEvents('./handlers/twitchHandlers');

    this.on('connect', async () => {
      console.log(chalk.green('Twitch client connected'));
      await this.fetchFFZ();
      await this.fetchFFZGlobal();
      await this.fetchBTTV();
      this.say('cycycy', 'TWITCHCLIENTCONNECTED bUrself');
    });

    this.on('error', async (err) => {
      console.error(`${chalk.red(err)}`);
    });

    this.connect();
    this.joinAll(this.config.twitchchannels);
  }
}

module.exports = TwitchClient;
