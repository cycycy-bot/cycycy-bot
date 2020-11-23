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
    const nam = 'NaM';
    const reason = args.join(' ');
    const { Afk, mongoose } = cb.db;

    if (reason.length >= 1024) return this.reply(`Your message is too long ${nam}`);

    const afk = new Afk({
      _id: mongoose.Types.ObjectId(),
      userID: message.senderUserID,
      userName: message.senderUsername,
      reason,
      date: new Date(),
      afkType: 'gn',
      isTucked: false,
    });

    Afk.find({ userID: message.senderUserID }).then((res) => {
      if (res.length >= 1) { // afk limiter
        return this.reply(`You are already AFK ${nam}`);
      }
      return afk.save()
        .then(this.bot.me(message.channelName, `${message.senderUsername} is now sleeping: ${reason || '🛏 💤'}`))
        .catch(err => console.error(err));
    });
  }
}

module.exports = Gn;
