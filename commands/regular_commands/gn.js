const Command = require('../../base/Command');

class Gn extends Command {
  constructor(bot) {
    super(bot, {
      name: 'gn',
      description: 'Sets your bot status to AFK',
      usage: '$gn <message>(optional)',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');
    const reason = args.join(' ');
    const { Afk, mongoose } = this.bot.db;

    if (reason.length >= 1024) return this.reply(`Your message is too long ${nam}`);

    const afk = new Afk({
      _id: mongoose.Types.ObjectId(),
      userID: message.author.id,
      userName: message.author.username,
      reason,
      date: new Date(),
      afkType: 'gn',
      isTucked: false,
    });

    Afk.find({ userID: message.author.id }).then((res) => {
      if (res.length >= 1) { // afk limiter
        return this.reply(`You are already AFK ${nam}`);
      }
      return afk.save()
        .then(this.respond(`${message.author.username} is now sleeping: ${reason || '🛏️'}, Somebody tuck them ${nam}`))
        .catch(err => this.reply(`Error ${err}`));
    });
  }
}

module.exports = Gn;
