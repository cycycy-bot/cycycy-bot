const Command = require('../../base/Command');

class SetWeebMod extends Command {
  constructor(bot) {
    super(bot, {
      name: 'setweebmod',
      description: 'Sets the weeb mod role in guild',
      usage: '$setweebmod <user>',
      permission: 'ADMINISTRATOR',
      cooldown: 1000,
      category: 'admin',
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');
    const { mongoose, Pedo } = this.bot.db;

    const weebMod = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!weebMod) return message.channel.send(`User not found ${nam}`);
    const DansGame = this.bot.emojis.find(emoji => emoji.name === 'DansGame');

    const pedomod = new Pedo({
      _id: mongoose.Types.ObjectId(),
      serverID: message.guild.id,
      serverName: message.guild.name,
      userID: weebMod.id,
      userName: weebMod.user.username,
    });

    Pedo.find({ serverID: message.guild.id, userID: weebMod.id }).then((pedoRes) => {
      if (pedoRes.length >= 1) {
        return this.respond(`User ${weebMod.user.username} is already a weeb mod ${nam}`);
      }
      return pedomod.save()
        .then(this.respond(`Pedo master added ${DansGame}`))
        .catch(err => this.reply(`Error ${err}`));
    }).catch(err => this.reply(`Error ${err}`));
  }
}
module.exports = SetWeebMod;
