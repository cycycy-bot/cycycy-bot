const Command = require('../../base/Command');

class ShoutOut extends Command {
  constructor(bot) {
    super(bot, {
      name: 'shoutout',
      description: 'Gives Shoutout to a streamer',
      usage: '$so <name>',
      aliases: ['so'],
      permission: 'mod',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const user = args[0];
    if (!user) return this.bot.say(message.channelName, 'No user argument found NaM');

    this.bot.say(message.channelName, `Checkout ${user}'s stream! NaM 👉 http://twitch.tv/${user}`);
  }
}

module.exports = ShoutOut;
