const Command = require('../../base/Command');

class Kick extends Command {
  constructor(bot) {
    super(bot, {
      name: 'kick',
      description: 'Kicks a member in the server',
      usage: '$kick <member>',
      cooldown: 0,
      permission: 'MODERATOR',
      category: 'mod',
    });
  }

  async run(message, args) {
    const { Mod } = cb.db;
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');
    const pepeS = this.bot.emojis.cache.find(emoji => emoji.name === 'PepeS');

    const toKick = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    const joinedArgs = args.slice(1).join(' ');
    if (!toKick) return this.reply(`User not found ${nam}`);

    Mod.findOne({ serverID: message.guild.id }).then(async (res) => {
      const serverRole = message.guild.roles.cache.get(res.modName);

      if (toKick.id === '487797385691398145') {
        return this.reply(`Can't kick my master ${pepeS}`);
      }
      if (toKick.hasPermission('ADMINISTRATOR')) {
        return this.reply(`Can't kick administrator ${nam}`);
      }
      if ((res.modName === serverRole.id
        && ((message.member.roles.cache.has(serverRole.id)) || message.member.hasPermission('ADMINISTRATOR')) && toKick.roles.cache.has(res.modName))) {
        return this.reply(`Admin/Mod can't kick a mod ${nam}`);
      }

      return toKick.kick(joinedArgs)
        .then(this.respond(`${toKick} has been kicked ${nam}`));
    });
  }
}

module.exports = Kick;
