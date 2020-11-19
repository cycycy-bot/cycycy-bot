const Commands = require('../../base/Command');

class Help extends Commands {
  constructor(bot) {
    super(bot, {
      name: 'help',
      description: 'Displays a list of available commands with description',
      usage: '$help',
      aliases: ['h'],
      cooldown: 0,
    });
  }

  async run(message, args) {
    const regularCommands = [];
    const modCommands = [];
    const adminCommands = [];
    const { Mod } = this.bot.db;

    await this.bot.commands.forEach((c) => {
      const { category } = c.help;
      const { aliases } = c.conf;

      if (category === 'regular') {
        regularCommands.push({ commandInfo: c.help, aliases });
      } else if (category === 'mod') {
        modCommands.push({ commandInfo: c.help, aliases });
      } else {
        adminCommands.push({ commandInfo: c.help, aliases });
      }
    });

    const commandName = args[0];

    Mod.findOne({ serverID: message.guild.id }).then((res) => {
      const serverRole = message.guild.roles.cache.get(res.modName);
      if (!commandName) {
        let output = `= Command List = \n\n[Use ${this.bot.config.prefix}help <commandname> for details]\n`;
        regularCommands.forEach((c) => {
          output += `${this.bot.config.prefix}${c.commandInfo.name} :: ${c.commandInfo.description}\n`;
        });
        this.respond(output, { code: 'asciidoc', split: { char: '\u200b' } });

        // send mod commands if member is a mod
        if (message.member.roles.cache.has(serverRole.id) || message.member.hasPermission('ADMINISTRATOR')) {
          output = `= Mod Commands List = \n\n[Use ${this.bot.config.prefix}help <commandname> for details]\n`;
          modCommands.forEach((c) => {
            output += `${this.bot.config.prefix}${c.commandInfo.name} :: ${c.commandInfo.description}\n`;
          });
          try {
            this.dm(output, { code: 'asciidoc', split: { char: '\u200b' } });
          } catch (e) {
            return this.reply("Your DMs are locked. I can't send mod commands");
          }
        }

        // send admin commands if member is a mod
        if (message.member.hasPermission('ADMINISTRATOR')) {
          output = `= Admin Command List = \n\n[Use ${this.bot.config.prefix}help <commandname> for details]\n`;
          adminCommands.forEach((c) => {
            output += `${this.bot.config.prefix}${c.commandInfo.name} :: ${c.commandInfo.description}\n`;
          });
          try {
            this.dm(output, { code: 'asciidoc', split: { char: '\u200b' } });
          } catch (e) {
            return this.reply("Your DMs are locked. I can't send mod commands");
          }
        }
      } else if (this.bot.commands.has(commandName)) {
        const command = this.bot.commands.get(commandName);
        this.respond(`= ${command.help.name} =\n${command.help.description}\nusage:: ${command.help.usage}\nalises:: ${command.conf.aliases.join(', ')}`, { code: 'asciidoc' });
      }
    });
  }
}

module.exports = Help;
