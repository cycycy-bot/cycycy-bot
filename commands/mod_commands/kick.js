const Command = require('../../base/Command');

class Kick extends Command {
  constructor(bot) {
    super(bot, {
      name: 'kick',
      description: 'Kicks a member in the server',
      usage: '$kick <member>',
      cooldown: 0,
      permission: 'MODERATOR',
      aliases: ['k'],
      category: 'mod',
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');
    const pepeS = this.bot.emojis.find(emoji => emoji.name === 'PepeS');

    const toKick = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    const joinedArgs = args.slice(1).join(' ');

    if (!toKick) return this.reply(`User not found ${nam}`);
    if (toKick.id === '487797385691398145') return this.reply(`Can't mute my master ${pepeS}`);
    if (toKick.hasPermission('ADMINISTRATOR')) return this.reply(`Can't mute administrator ${nam}`);

    return toKick.kick(joinedArgs)
      .then(this.respond(`${toKick} has been kicked ${nam}`));
  }
}

module.exports = Kick;
