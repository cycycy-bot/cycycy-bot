const Filter = require('bad-words');
const Command = require('../../base/Command');

const filter = new Filter({ placeHolder: '*' });

class ShowEmote extends Command {
  constructor(bot) {
    super(bot, {
      name: 'reloademote',
      description: 'reloads 3rd party emotes',
      usage: '$reloademote',
      aliases: ['re'],
      cooldown: 2000,

    });
  }

  async run(message, args) {
    if (message.senderUserID !== this.bot.config.twitchowner) return;
    if (!message.channelName === 'cycycy') return;

    await this.bot.fetchFFZ();
    await this.bot.fetchFFZGlobal();
    await this.bot.fetchBTTV();

    return this.bot.say(message.channelName, 'Emotes Reloaded KKona');
  }
}

module.exports = ShowEmote;
