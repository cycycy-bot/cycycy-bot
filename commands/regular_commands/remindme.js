const Discord = require('discord.js');
const ms = require('ms');
const Command = require('../../base/Command');

class RemindMe extends Command {
  constructor(bot) {
    super(bot, {
      name: 'remindme',
      description: 'Sends a DM in specified time',
      usage: '$remindme <time> <message>',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const nam = this.bot.emojis.find(emoji => emoji.name === 'NaM');

    const time = args[0];
    const rmdMessage = args.slice(1).join(' ');

    this.reply(`I will send you a message in ${time} ${nam}`);

    const remindEmbed = new Discord.RichEmbed()
      .addField(`A reminder from you ${time} ago`, rmdMessage);
    setTimeout(() => {
      try {
        this.dm(remindEmbed);
      } catch (e) {
        return this.reply('Your DMs are locked. I can\'t send you a reminder.');
      }
    }, ms(time));
  }
}

module.exports = RemindMe;
