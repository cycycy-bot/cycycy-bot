const ms = require('ms');
const Command = require('../../base/Command');

class Birthday extends Command {
  constructor(bot) {
    super(bot, {
      name: 'birthday',
      description: 'Gives a member the birthday role for 24hrs',
      usage: '$birthday <user>',
      cooldown: 0,
      permission: 'MODERATOR',
      category: 'mod',
      aliases: ['bd', 'bday'],
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.cache.find(emoji => emoji.name === 'NaM');

    const birthdayBoy = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if (!birthdayBoy) return message.channel.send(`User not found ${nam}`);

    const birthdayRole = message.guild.roles.cache.find(role => role.id === '702638849737621575');
    if (birthdayBoy.roles.cache.has(birthdayRole.id)) return this.reply(`${birthdayBoy.user.username} already has the ${birthdayRole.name} role`);
    await birthdayBoy.roles.cache.add(birthdayRole);
    this.respond(`<@${birthdayBoy.id}> happy birthday! ${nam}`);
    setTimeout(() => {
      birthdayBoy.roles.cache.remove(birthdayRole);
    }, ms('24h'));
  }
}

module.exports = Birthday;
