const Discord = require('discord.js');
const Command = require('../../base/Command');

class Advice extends Command {
  constructor(bot) {
    super(bot, {
      name: 'advice',
      description: 'Gives advice',
      usage: '$advice',
      aliases: ['adv'],
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const omgScoots = 'OMGScoots';
    this.bot.fetch('https://api.adviceslip.com/advice')
      .then(res => res.json())
      .then((res) => {
        this.bot.me(message.channelName, `@${message.senderUsername} here is your advice ${omgScoots}: ${res.slip.advice}`);
      })
      .catch(err => console.error(err));
  }
}

module.exports = Advice;
