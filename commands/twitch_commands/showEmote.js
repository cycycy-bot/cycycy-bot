const Command = require('../../base/Command');

class ShowEmote extends Command {
  constructor(bot) {
    super(bot, {
      name: 'showemote',
      description: 'shows emote on stream',
      usage: '$showemote <emote_name>',
      aliases: ['se'],
      cooldown: 2000,
    });
  }

  async run(message, args) {
    if (!args) return;
    if (!message.channelName === 'cycycy') return;
    const emoteName = args[0];

    const isBTTVEmote = this.bot.bttv.some(bttvE => bttvE.code === emoteName);
    const isFFZEmote = this.bot.ffz.some(ffzE => ffzE.name === emoteName);
    const isFFZGlobalEmote = this.bot.ffzGlobal.some(ffzE => ffzE.name === emoteName);
    const twitchEmote = message.emotes[0];

    if (isBTTVEmote) {
      const BTTVemote = this.bot.bttv.find(bttvE => bttvE.code === emoteName);
      if (!BTTVemote) return;
      return this.bot.ws.send(`https://cdn.betterttv.net/emote/${BTTVemote.id}/3x.${BTTVemote.imageType}`);
    }

    if (isFFZEmote) {
      const FFZemote = this.bot.ffz.find(ffzE => ffzE.name === emoteName);
      if (!FFZemote) return;
      return this.bot.ws.send(FFZemote.urls[4]);
    }

    if (isFFZGlobalEmote) {
      const FFZemote = this.bot.ffzGlobal.find(ffzE => ffzE.name === emoteName);
      if (!FFZemote) return;
      return this.bot.ws.send(FFZemote.urls[4] || FFZemote.urls[1]);
    }

    if (twitchEmote) {
      this.bot.ws.send(`https://static-cdn.jtvnw.net/emoticons/v1/${twitchEmote.id}/3.0`);
    }
  }
}

module.exports = ShowEmote;
