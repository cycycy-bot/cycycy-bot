const Command = require('../../base/Command');

class AfkCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'afk',
      description: 'Sets your bot status to AFK',
      usage: '$afk <message>(optional)',
      cooldown: 5000,
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');
    const { mongoose, Afk } = this.bot.db;

    const reason = args.join(' ');

    if (reason.length >= 1024) return this.reply(`Your message is too long ${nam}`);

    const afk = new Afk({
      _id: mongoose.Types.ObjectId(),
      userID: message.author.id,
      userName: message.author.username,
      reason,
      date: new Date(),
      afkType: 'afk',
    });

    Afk.find({ userID: message.author.id }).then((res) => {
      if (res.length >= 1) { // afk limiter
        return this.reply(`You are already AFK ${nam}`);
      }
      afk.save()
        .then(this.reply(`is now AFK: ${reason}`))
        .catch(err => this.reply(`Error ${err}`));
    });
  }
}

module.exports = AfkCommand;
