const { version } = require('discord.js');
const Command = require('../../base/Command');

class Stats extends Command {
  constructor(bot) {
    super(bot, {
      name: 'stats',
      description: 'Shows the bot stats',
      usage: '$stats',
      permission: 'ADMINISTRATOR',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    let totalSeconds = (this.bot.uptime / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const upTime = `${days} days(${hours} hours, ${minutes} minutes and ${Math.trunc(seconds)} seconds)`;

    return this.respond('Pinging...')
      .then((m) => {
        const ping = m.createdTimestamp - message.createdTimestamp;

        m.edit(`=== STATISTICS ===
        \`Mem Usage:\` ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
        \`Bot Latency:\` ${ping}ms 
        \`API Latency:\` ${Math.round(this.bot.ping)}ms 
        \`Server Region:\` ${message.guild.region}
        \`Uptime:\` ${upTime}
        \`Servers:\` ${this.bot.guilds.size.toLocaleString()}
        \`Cybot:\` v${require('../../package.json').version}
        \`Discord.js:\` v${version}
        \`Node:\` ${process.version}
        `);
      }).catch(err => message.reply(err));
  }
}

module.exports = Stats;
