const Discord = require('discord.js');
const Command = require('../../base/Command');

class BotInfo extends Command {
  constructor(bot) {
    super(bot, {
      name: 'botinfo',
      description: 'Shows the bot\'s information',
      usage: '$botinfo',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const forHEad = this.bot.emojis.find(emoji => emoji.name === '4HEad');
    const botEmbed = new Discord.RichEmbed()
      .setDescription('Bot Information')
      .setColor('#00b22c')
      .setThumbnail(this.bot.user.displayAvatarURL)
      .addField(this.bot.user.username, `Multi-purpose bot for discord ${forHEad}`)
      .addField('Created On', this.bot.user.createdAt)
      .setFooter('Bot made by cycycy | github repo: github.com/galoncyryll/cycycy-bot', this.bot.user.displayAvatarURL);

    return this.respond(botEmbed);
  }
}

module.exports = BotInfo;
