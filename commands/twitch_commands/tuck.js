const Command = require('../../base/Command');

class Tuck extends Command {
  constructor(bot) {
    super(bot, {
      name: 'tuck',
      description: 'Tucks an Afk/Gn user',
      usage: '$tuck <member>',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const nam = 'NaM';
    const weirdChamp = 'WeirdChamp';

    const tucked = args[0];
    if (!tucked) return this.bot.say(message.channelName, `User not found ${nam}`);
    if (tucked === message.senderUsername) return this.bot.say(message.channelName, `You can't tuck yourself ${weirdChamp}`);

    this.bot.say(message.channelName, `${message.senderUsername} tucked ${tucked} to bed ${args[1] ? args[1] : nam} 👉 🛏️`);
  }
}

module.exports = Tuck;
