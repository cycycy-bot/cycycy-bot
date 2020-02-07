const messageChecker = require('./_messageChecker');
const botconfig = require('../botconfig.json');
const db = require('../settings/databaseImport');

module.exports = (bot, message) => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  if (bot.cooldown.has(message.author.id)) return;

  const { prefix } = botconfig;
  const messageArray = message.content.split(' ');
  const cmd = messageArray[0].toLowerCase();
  const args = messageArray.slice(1);

  // Emotes
  const NaM = bot.emojis.find(emoji => emoji.name === 'NaM');
  const OMGScoots = '<:OMGScoots:669029552495788082>';
  const weirdChamp = bot.emojis.find(emoji => emoji.name === 'WeirdChamp');

  // message checker handler
  messageChecker.handleMessage(bot, message, cmd, prefix, db, weirdChamp, NaM, OMGScoots);

  // call command handler
  const cmdFile = bot.commands.get(cmd.slice(prefix.length));
  if (cmdFile && cmd.startsWith(prefix)) cmdFile.run(bot, message, args, NaM, OMGScoots);

  // type
  if (message.isMentioned(bot.user)) {
    const msgArr = [
      `What ${weirdChamp} ❓`,
      `Stop tagging me ${weirdChamp}`,
      `What do you want ${weirdChamp}`,
      `Are you actually tagging me ${weirdChamp}`,
    ];
    message
      .channel
      .startTyping(100);
    setTimeout(() => {
      message
        .reply(msgArr[Math.floor(Math.random() * msgArr.length)]);
      return message
        .channel
        .stopTyping(true);
    }, 2000);
  }
};
