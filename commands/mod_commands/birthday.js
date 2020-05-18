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
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');

    const birthdayBoy = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!birthdayBoy) return message.channel.send(`User not found ${nam}`);

    const birthdayRole = message.guild.roles.find(role => role.id === '702638849737621575');
    if (birthdayBoy.roles.has(birthdayRole.id)) return this.reply(`${birthdayBoy.user.username} already has the ${birthdayRole.name} role`);
    await birthdayBoy.addRole(birthdayRole);
  }
}

module.exports = Birthday;
