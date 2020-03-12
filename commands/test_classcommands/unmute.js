const Command = require('../../base/Command');

class Unmute extends Command {
  constructor(bot) {
    super(bot, {
      name: 'unmute',
      description: 'Unmutes a muted member 4Head',
      usage: '$unmute <member>',
      cooldown: 0,
      permission: 'MODERATOR',
      aliases: ['um'],
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');
    const unMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    const muteRole = message.guild.roles.find(x => x.name === 'muted');
    if (!unMute) return message.channel.send(`User not found ${nam}`);
    if (!message.member.roles.find(role => role.name === 'Mod cucks')) return message.reply(`You don't have permission for this command ${nam}`);

    if (unMute.roles.find(x => x.name === 'muted')) {
      unMute.removeRole(muteRole.id);
      this.respond(`<@${unMute.id}> has been unmuted!`);
    } else {
      this.respond(`<@${unMute.id}> is not muted!`);
    }
  }
}

module.exports = Unmute;
