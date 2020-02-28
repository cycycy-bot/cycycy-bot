const Command = require('../../base/Command');

class DelBanPhrase extends Command {
  constructor(bot) {
    super(bot, {
      name: 'delbanphrase',
      description: 'Deletes a ban phrase in the server',
      usage: '$delbanphrase <word>',
      cooldown: 0,
      permission: 'MODERATOR',
      aliases: ['dbp'],
    });
  }

  run(message, args, NaM) {
    const bp = args.join(' ');
    if (!bp) return this.reply(`Please add a word to be unbanned ${NaM}`);

    this.bot.db.BanPhrase.deleteOne({ serverID: message.guild.id, banphrase: bp }).then((bpRes) => {
      if (bpRes.n >= 1) {
        this.reply(`The ban phrase \`${bp}\` has been deleted ${NaM}`);
      } else {
        this.reply(`Ban phrase doesn't exist ${NaM}`);
      }
    });
  }
}

module.exports = DelBanPhrase;
