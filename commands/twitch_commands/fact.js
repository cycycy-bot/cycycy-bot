const Command = require('../../base/Command');

class Advice extends Command {
  constructor(bot) {
    super(bot, {
      name: 'fact',
      description: 'Gives random fact',
      usage: '$fact',
      cooldown: 10000,
    });
  }

  async run(message, args) {
    const url = 'https://uselessfacts.jsph.pl/random.json?language=en';
    this.bot.fetch(url)
      .then(res => res.json())
      .then((res) => {
        this.bot.say(message.channelName, `Random Useless Fact: ${res.text} 4Head`);
      })
      .catch(err => console.error(err));
  }
}

module.exports = Advice;
