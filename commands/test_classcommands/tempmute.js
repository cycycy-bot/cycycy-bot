const ms = require('ms');
const Command = require('../../base/Command');

class TempMute extends Command {
  constructor(bot) {
    super(bot, {
      name: 'tempmute',
      description: 'Mutes a member',
      usage: '$tempmute <member> <length>',
      cooldown: 0,
      permission: 'MODERATOR',
      aliases: ['mute', 'tm'],
    });
  }

  async run(message, args) {
    const toMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    const PepeS = this.bot.emojis.find(emoji => emoji.name === 'PepeS');
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');

    if (!toMute) return message.channel.send(`User not found ${nam}`);
    if (toMute.id === '487797385691398145') {
      return message.reply(`Can't mute my master ${PepeS}`);
    } if (toMute.hasPermission('ADMINISTRATOR')) {
      return message.reply(`Can't mute administrator ${nam}`);
    } if (message.member.id === '487797385691398145') {
      console.log('Tempmute command fired by cycycy'); // command for cycycy(owner)
    } if (message.member.hasPermission('ADMINISTRATOR')) {
      console.log(`Admin command from: ${message.guild.name}`); // ignore if admin fired the command
    } if (toMute.hasPermission('KICK_MEMBERS') || toMute.hasPermission('BAN_MEMBERS')) {
      return message.reply(`Can't mute a mod ${nam}`);
    }

    let muteRole = message.guild.roles.find(role => role.name === 'muted');
    if (!muteRole) {
      try {
        muteRole = await message.guild.createRole({
          name: 'muted',
          color: '#ff0000',
          permissions: [],
        });
        message.guild.channels.forEach(async (channel) => {
          await channel.overwritePermissions(muteRole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
          });
        });
      } catch (e) {
        console.log(e.stack);
      }
    }

    const muteTime = args[1];
    if (!muteTime || ms(muteTime) === undefined) return this.reply("You didn't specify a time!");
    if (toMute.roles.has(muteRole.id)) return this.reply(`${toMute.user.username} is already muted`);

    await toMute.addRole(muteRole);
    this.reply(`<@${toMute.id}> has been muted for ${muteTime}`);

    setTimeout(() => {
      if (toMute.roles.find(x => x.name === 'muted')) {
        toMute.removeRole(muteRole.id);
        this.respond(`<@${toMute.id}> has been unmuted!`);
      }
    }, ms(muteTime));
  }
}

module.exports = TempMute;
