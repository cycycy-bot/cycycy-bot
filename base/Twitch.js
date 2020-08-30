const { ChatClient } = require('dank-twitch-irc');
const chalk = require('chalk');
const { readdir } = require('fs');
const WebSocket = require('ws');
const { mongoose, TwitchLog } = require('../settings/databaseImport');
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
     * Fetch Module
     * @type {Object}
     */
    this.fetch = require('node-fetch');

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
   * Loads all FFZ channel emotes
   */
  async fetchFFZ() {
    const baseURL = 'https://api.frankerfacez.com/v1/room';
    const response = await this.fetch(`${baseURL}/cycycy`, {
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
    const response = await this.fetch(`${baseURL}`, {
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
    const response = await this.fetch(`${channelbaseURL}`, {
      method: 'get',
      headers: { 'content-type': 'application/json' },
    });
    const json1 = await response.json();
    const channelEmotes = json1.emotes;

    const response2 = await this.fetch(`${globalbaseURL}`, {
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

    this.on('PRIVMSG', (message) => {
      if (message.senderUsername === this.configuration.username) return;
      const twitchMsg = new TwitchLog({
        _id: mongoose.Types.ObjectId(),
        userID: message.senderUserID,
        userName: message.senderUsername,
        channel: message.channelName,
        message: message.messageText,
        date: new Date(),
      });

      // donker
      const donks = ['donk', 'feelsdankman', 'feelsdonkman'];
      if (donks.some(donk => message.messageText.toLowerCase().includes(donk.toLowerCase()))) {
        if (this.cooldown.has(message.senderUserID)) return;
        this.say(message.channelName, 'FeelsDonkMan 👍 ');
        this.cooldown.add(message.senderUserID);

        setTimeout(() => {
          this.cooldown.delete(message.senderUserID);
        }, 10000);
      }

      // trihard
      const trihards = ['trihard', 'widehardo'];
      if (trihards.some(tri => message.messageText.toLowerCase().includes(tri.toLowerCase()))) {
        if (this.cooldown.has(message.senderUserID)) return;
        this.say(message.channelName, 'TriHard 7');
        this.cooldown.add(message.senderUserID);

        setTimeout(() => {
          this.cooldown.delete(message.senderUserID);
        }, 10000);
      }

      // pepege
      const pepege = ['pepega', 'pepege'];
      if (pepege.some(pepeg => message.messageText.toLowerCase().includes(pepeg.toLowerCase()))) {
        if (this.cooldown.has(message.senderUserID)) return;
        this.say(message.channelName, 'Pepege Clap');
        this.cooldown.add(message.senderUserID);

        setTimeout(() => {
          this.cooldown.delete(message.senderUserID);
        }, 10000);
      }

      // COMMANDS
      const { prefix } = this.config;
      const messageArray = message.messageText.split(' ');
      const cmd = messageArray[0].toLowerCase();
      const args = messageArray.slice(1);


      // call command handler
      const cmdFile = this.commands.get(cmd.slice(prefix.length)) || this.commands.get(this.aliases.get(cmd.slice(prefix.length)));

      // return if command is not found
      if (!cmdFile) return;
      // return if command doesnt start with prefix
      if (!cmd.startsWith(prefix)) return;

      if (cmdFile.cooldown.has(message.senderUserID)) return;

      if (cmdFile && cmd.startsWith(prefix))cmdFile.run(message, args);
      if (cmdFile.conf.cooldown > 0) cmdFile.startCooldown(message.senderUserID);
      return twitchMsg.save();
    });

    this.on('connect', async () => {
      console.log(chalk.green('Twitch client connected'));
      await this.fetchFFZ();
      await this.fetchFFZGlobal();
      await this.fetchBTTV();
      this.say('cycycy', 'Twitch client connected');
    });

    this.connect();
    this.join('cycycy');
  }
}

module.exports = TwitchClient;
