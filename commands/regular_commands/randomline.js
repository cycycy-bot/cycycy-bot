const Command = require('../../base/Command');

class RandomLine extends Command {
  constructor(bot) {
    super(bot, {
      name: 'rl',
      description: 'Random line from cycycy\'s twitch chat logs',
      usage: '$rl <twitch_user>',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');
    const { mongoose, Notify } = this.bot.db;

    const notifyUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    const notifyMsg = args.join(' ').slice(22);
    if (!notifyUser) {
      return this.respond(`User not found in server ${nam}`);
    }
    if (!notifyMsg) {
      return this.respond(`Please add a message ${nam}`);
    }

    const notify = new Notify({
      _id: mongoose.Types.ObjectId(),
      username: notifyUser.user.username,
      userID: notifyUser.id,
      senderName: message.author.username,
      senderAvatar: message.member.user.avatarURL,
      serverName: message.guild.name,
      notifyMsg,
      msgUrl: message.url,
      date: new Date(),
    });

    Notify.find({ userID: notifyUser.id }).then((results) => {
      if (results.length >= 3) { // message limiter
        return this.reply(`${notifyUser} has already reached the limit of recieving messages ${nam}`);
      }
      notify.save()
        .then(() => this.reply(`${notifyUser} will be notified: ${notifyMsg}`))
        .catch(err => this.reply(`Error ${err}`));
    });
  }
}

module.exports = RandomLine;
