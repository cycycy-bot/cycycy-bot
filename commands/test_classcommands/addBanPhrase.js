const Command = require('../../base/Command');

class AddBanPhrase extends Command {
  constructor(bot) {
    super(bot, {
      name: 'addbanphrase',
      description: 'Adds a ban phrase in the server',
      usage: '$addbanphrase <word>',
      cooldown: 0,
      permission: 'MODERATOR',
      aliases: ['abp'],
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');
    const bp = args.join(' ');
    if (!bp) return this.reply(`Please add a word to be banned ${nam}`);

    const banphrase = new this.bot.db.BanPhrase({
      _id: this.bot.db.mongoose.Types.ObjectId(),
      serverID: message.guild.id,
      serverName: message.guild.name,
      banphrase: bp,
    });

    this.bot.db.BanPhrase.find({ serverID: message.guild.id, banphrase: bp }).then((serverRes) => {
      if (serverRes.length >= 1) {
        return this.respond('Banphrase already exists');
      }
      return banphrase.save()
        .then(this.respond('Banphrase added'))
        .catch(err => this.reply(`Error ${err}`));
    });
  }
}

module.exports = AddBanPhrase;
