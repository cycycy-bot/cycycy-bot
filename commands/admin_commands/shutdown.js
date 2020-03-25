const process = require('process');
const Command = require('../../base/Command');

class ShutDown extends Command {
  constructor(bot) {
    super(bot, {
      name: 'shutdown',
      description: 'Shuts down the bot',
      usage: '$shutdown',
      ownerOnly: true,
      cooldown: 0,
      category: 'admin',
    });
  }

  async run(message, args) {
    const Pepege = this.bot.emojis.find(emoji => emoji.name === 'Pepege');

    return message.channel.send(`Shutting down... ${Pepege}`)
      .then(() => this.bot.destroy())
      .then(() => process.exit())
      .catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = ShutDown;
