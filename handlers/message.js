const messageChecker = require('./_messageChecker');
const botconfig = require('../botconfig.json');

const { prefix } = botconfig;

module.exports = (bot, message) => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  const cycycyHalt = bot.emojis.find(emoji => emoji.name === 'cycycyHalt');
  if (bot.cooldown.has(message.author.id)) {
    return message.reply(`You're sending commands too fast ${cycycyHalt} halt.`);
  }

  const messageArray = message.content.split(' ');
  const cmd = messageArray[0].toLowerCase();
  const args = messageArray.slice(1);

  // Emotes
  const NaM = bot.emojis.find(emoji => emoji.name === 'NaM');
  const OMGScoots = '<:OMGScoots:669029552495788082>';
  const weirdChamp = bot.emojis.find(emoji => emoji.name === 'WeirdChamp');

  // message checker handler
  messageChecker.handleMessage(bot, message, cmd, prefix, weirdChamp, NaM, OMGScoots);

  // call command handler
  const cmdFile = bot.commands.get(cmd.slice(prefix.length));
  if (cmdFile && cmd.startsWith(prefix)) cmdFile.run(bot, message, args, NaM, OMGScoots);
};
