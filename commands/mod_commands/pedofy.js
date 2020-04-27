const Command = require('../../base/Command');

class Pedofy extends Command {
  constructor(bot) {
    super(bot, {
      name: 'pedofy',
      description: 'Gives a member a Pedo(weeb) role',
      usage: '$pedofy <member>',
      cooldown: 0,
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');
    const { Pedo } = this.bot.db;

    Pedo.findOne({ serverID: message.guild.id, userID: message.member.id }).then((pedoRes) => {
      if (!pedoRes) {
        return this.reply(`You dont have permission for this command ${nam}`);
      }
      if (args[0] === 'help') {
        return this.respond('```Usage: $pedofy <user>```');
      }

      const pedo = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      const weirdChamp = this.bot.emojis.find(emoji => emoji.name === 'WeirdChamp');
      if (!pedo) return this.respond(`User not found ${nam}`);
      if (pedo.id === '487797385691398145') return this.respond(`My master is not a pedo ${weirdChamp}`);

      let pedoRole = message.guild.roles.find(role => role.name === 'Pedo');
      if (!pedoRole) {
        pedoRole = message.guild.createRole({
          name: 'Pedo',
          color: '#ff11b0',
          permissions: ['SEND_MESSAGES'],
        })
          .then(prole => pedo.addRole(prole.id))
          .then(this.respond(`${pedo.user.username} is now a Pedo`))
          .catch(err => this.reply(`Error ${err}`));
      } else {
        return pedo.addRole(pedoRole)
          .then(this.respond(`${pedo.user.username} is now a Pedo`))
          .catch(err => this.reply(`Error ${err}`));
      }
    }).catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = Pedofy;
