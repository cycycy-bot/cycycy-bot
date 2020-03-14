// const mongoose = require('mongoose');
// const Mod = require('../../models/modDBtest');
const Command = require('../../base/Command');

class SetMod extends Command {
  constructor(bot) {
    super(bot, {
      name: 'setmod',
      description: 'Sets the mod role in guild',
      usage: '$setmod <mod_role_name>>',
      permission: 'ADMINISTRATOR',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');
    const { mongoose, Mod } = this.bot.db;

    const role = args.join(' ');
    const roleFinder = message.guild.roles.find(r => r.name === role);

    if (!roleFinder) return this.reply(`Role doesn't exist ${nam}`);

    const mod = new Mod({
      _id: mongoose.Types.ObjectId(),
      serverID: message.guild.id,
      serverName: message.guild.name,
      modName: roleFinder.id,
    });

    Mod.find({ serverID: message.guild.id }).then((res) => {
      if (res.length >= 1) {
        return this.reply(`Mod already exist in this server ${nam} You can edit mod name in this server by doing $editmod ${nam}`);
      }
      return mod.save()
        .then(this.reply(`Mod role added ${nam}`))
        .catch(err => this.reply(`Error ${err}`));
    }).catch(err => this.reply(`Error ${err}`));
  }
}

module.exports = SetMod;
