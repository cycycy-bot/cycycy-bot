const Command = require('../../base/Command');

class SetAntiWeeb extends Command {
  constructor(bot) {
    super(bot, {
      name: 'setantiweeb',
      description: 'Toggles the anti weeb response on a server',
      usage: '$setantiweeb <enable/disable>',
      permission: 'ADMINISTRATOR',
      cooldown: 1000,
      category: 'admin',
    });
  }

  async run(message, args) {
    const okayChamp = this.bot.emojis.cache.find(emoji => emoji.name === 'OkayChamp');
    const dansGame = this.bot.emojis.cache.find(emoji => emoji.name === 'DansGame');
    const { mongoose, AntiWeeb } = cb.db;
    const isEnabled = args[0];

    if (!isEnabled) return this.reply('Please add `enable` or `disable` as 3rd argument. Use `$help setantiweeb` for setting the anti weeb channel.');
    if (isEnabled === 'enable') {
      const antiweeb = new AntiWeeb({
        _id: mongoose.Types.ObjectId(),
        serverID: message.guild.id,
        serverName: message.guild.name,
        isEnabled: true,
      });

      AntiWeeb.findOne({ serverID: message.guild.id }).then((res) => {
        if (res) {
          return AntiWeeb.updateOne({ serverID: message.guild.id },
            {
              isEnabled: true,
              serverName: message.guild.name,
            })
            .then(this.respond(`Anti weeb is now enabled in this server ${okayChamp}`))
            .catch(err => this.reply(`Error ${err}`));
        }
        return antiweeb.save()
          .then(this.respond(`Anti weeb is now enabled in this server ${okayChamp}`))
          .catch(err => this.reply(`Error ${err}`));
      }).catch(err => this.reply(`Error ${err}`));
    } else if (isEnabled === 'disable') {
      AntiWeeb.findOne({ serverID: message.guild.id }).then((res) => {
        if (res) {
          return AntiWeeb.updateOne({ serverID: message.guild.id },
            { isEnabled: false })
            .then(this.respond(`Anti weeb is disabled ${dansGame}`))
            .catch(err => this.reply(`Error ${err}`));
        }
        return this.respond(`Anti weeb has not been setup in this server yet ${dansGame}`);
      }).catch(err => this.reply(`Error ${err}`));
    } else {
      return this.respond('An error has occured. Use `$help setantiweeb` for setting the antiweeb module.');
    }
  }
}

module.exports = SetAntiWeeb;
