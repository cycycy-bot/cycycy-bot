const Command = require('../../base/Command');

class Tuck extends Command {
  constructor(bot) {
    super(bot, {
      name: 'truck',
      description: 'Trucks an Afk/Gn user',
      usage: '$truck <member>',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');
    const kkozy = this.bot.emojis.find(emoji => emoji.name === 'KKozy');
    const weirdChamp = this.bot.emojis.find(emoji => emoji.name === 'WeirdChamp');
    const { Afk } = this.bot.db;

    const tucked = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!tucked) return this.respond(`User not found ${nam}`);
    if (tucked.id === message.author.id) return this.reply(`You can't tuck yourself ${weirdChamp}`);

    Afk.find({ userID: tucked.id }).then((res) => {
      if (res.length >= 1) {
        if (res[0].isTucked) {
          return this.reply(`Tucking the tucked ${weirdChamp}`);
        } if (!res[0].isTucked) {
          return Afk.updateOne({ userID: tucked.id }, { isTucked: true, tucker: message.author.username })
            .then(() => {
              this.respond(`<@${message.author.id}> trucked ${tucked.displayName} to bed ${kkozy} 👉 🛏️ HELL YEAH BROTHER`);
            });
        }
      } else {
        return this.reply(`${tucked.displayName} is not even asleep ${weirdChamp}`);
      }
    });
  }
}

module.exports = Tuck;
