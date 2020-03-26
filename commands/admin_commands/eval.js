/* eslint-disable no-eval */
const Command = require('../../base/Command');

class Eval extends Command {
  constructor(bot) {
    super(bot, {
      name: 'eval',
      description: 'Evaluates arbitrary Javascript.',
      usage: 'eval <expression>',
      aliases: ['ev'],
      category: 'admin',
      ownerOnly: true,
      cooldown: 0,
    });
  }

  async run(message, args) {
    const code = args.join(' ');
    try {
      const evaled = eval(code);
      const clean = await this.bot.clean(evaled);
      // sends evaled output as a file if it exceeds the maximum character limit
      // 6 graves, and 2 characters for "js"
      const MAX_CHARS = 3 + 2 + clean.length + 3;
      if (MAX_CHARS > 2000) {
        return this.respond('Output exceeded 2000 characters. Sending as a file.', { files: [{ attachment: Buffer.from(clean), name: 'output.txt' }] });
      }
      this.respond(`\`\`\`js\n${clean}\n\`\`\``);
    } catch (err) {
      const clean = await this.bot.clean(err);

      const MAX_CHARS = 3 + 2 + clean.length + 3;
      if (MAX_CHARS > 2000) {
        return this.respond('Output exceeded 2000 characters. Sending as a file.', { files: [{ attachment: Buffer.from(clean), name: 'output.txt' }] });
      }
      this.respond(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``, { split: { maxLength: 2000, append: '```', prepend: '```' } });
    }
  }
}

module.exports = Eval;
