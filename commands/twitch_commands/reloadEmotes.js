
const Command = require('../../base/Command');


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

    await cb.fetchFFZ();
    await cb.fetchFFZGlobal();
    await cb.fetchBTTV();

    return this.bot.say(message.channelName, 'Emotes Reloaded KKona');
  }
}

module.exports = ShowEmote;
