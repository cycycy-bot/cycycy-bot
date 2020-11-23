const Command = require('../../base/Command');

class DelWeebMod extends Command {
  constructor(bot) {
    super(bot, {
      name: 'delweebmod',
      description: 'Removes a weeb mod role from a user',
      usage: '$delweebmod <user>',
      aliases: ['dwm'],
      permission: 'ADMINISTRATOR',
      cooldown: 0,
      category: 'admin',
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');
    const { Pedo } = cb.db;

    const weebMod = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if (!weebMod) return this.respond(`User not found ${nam}`);

    Pedo.deleteOne({ serverID: message.guild.id, userID: weebMod.id }).then((pedoRes) => {
      if (pedoRes.n >= 1) {
        return this.reply(`Weeb mod ${weebMod.user.username} deleted ${nam}`);
      }
      return this.reply('Weeb mod not found');
    }).catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = DelWeebMod;
