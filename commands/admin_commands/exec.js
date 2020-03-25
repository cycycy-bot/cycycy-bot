const { exec } = require('child_process');
const Command = require('../../base/Command');

class Exec extends Command {
  constructor(bot) {
    super(bot, {
      name: 'exec',
      description: 'Executes shell commands',
      usage: 'exec <expression>',
      aliases: ['ex'],
      category: 'admin',
      ownerOnly: true,
      cooldown: 0,
    });
  }

  async run(message, args) { // eslint-disable-line no-unused-vars
    const code = args.join(' ');
    try {
      exec(code, async (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        const clean = await this.bot.clean(stdout);
        // sends exec output as a file if it exceeds the maximum character limit
        // 6 graves, and 2 characters for "js"
        const MAX_CHARS = 3 + 2 + clean.length + 3;
        if (MAX_CHARS > 2000) {
          this.respond('Output exceeded 2000 characters. Sending as a file.', { files: [{ attachment: Buffer.from(clean), name: 'output.txt' }] });
        }
        this.respond(`\`\`\`js\n${clean}\n\`\`\``);
      });
    } catch (err) {
      this.respond(`\`ERROR\` \`\`\`xl\n${await this.bot.clean(err)}\n\`\`\``, { split: { maxLength: 2000, append: '```', prepend: '```' } });
    }
  }
}

module.exports = Exec;
