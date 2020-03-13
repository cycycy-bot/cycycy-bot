const Command = require('../../base/Command');

class Restart extends Command {
  constructor(bot) {
    super(bot, {
      name: 'restart',
      description: 'Restarts the bot',
      usage: '$rolecount',
      permission: 'ADMINISTRATOR',
      ownerOnly: true,
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const pepege = this.bot.emojis.find(emoji => emoji.name === 'Pepege');

    return message.channel.send(`Restarting... ${pepege}`)
      .then(this.bot.destroy())
      .then(() => this.bot.login(process.env.BOT_TOKEN))
      .catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = Restart;
