const Command = require('../../base/Command');

class RoleCount extends Command {
  constructor(bot) {
    super(bot, {
      name: 'rolecount',
      description: 'Returns the number of members in a role',
      usage: '$rolecount',
      permission: 'ADMINISTRATOR',
      aliases: ['rc'],
      cooldown: 1000,
      category: 'admin',
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');

    const role = args.join(' ');
    const roleFinder = message.guild.roles.find(r => r.name === role);
    if (roleFinder) {
      const roleSize = message.guild.roles.get(roleFinder.id).members;
      if (roleSize) return this.respond(`${role} has ${roleSize.size} members in this server`);
    } else {
      return this.respond(`Role not found ${nam}`);
    }
  }
}

module.exports = RoleCount;
