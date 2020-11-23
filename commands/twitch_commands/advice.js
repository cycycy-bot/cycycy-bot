const Command = require('../../base/Command');

class Advice extends Command {
  constructor(bot) {
    super(bot, {
      name: 'advice',
      description: 'Gives advice',
      usage: '$advice',
      aliases: ['adv'],
      cooldown: 15000,
    });
  }

  async run(message, args) {
    const omgScoots = 'OMGScoots';
    cb.fetch('https://api.adviceslip.com/advice')
      .then(res => res.json())
      .then((res) => {
        this.bot.me(message.channelName, `@${message.senderUsername} here is your advice: ${res.slip.advice} ${omgScoots}`);
      })
      .catch(err => console.error(err));
  }
}

module.exports = Advice;
