const messageChecker = require('./_messageChecker');

module.exports = (bot, message) => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  const { prefix } = bot.config;
  const messageArray = message.content.split(' ');
  const cmd = messageArray[0].toLowerCase();
  const args = messageArray.slice(1);

  // message checker handler
  messageChecker.handleMessage(bot, message, cmd, prefix);

  // call command handler
  const cmdFile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));
  // return if command is not found
  if (!cmdFile) return;

  // checks if the user in on cooldown
  if (cmdFile.cooldown.has(message.author.id)) return;

  // permission checker
  cmdFile.setMessage(message);
  cmdFile.hasPermission().then((perm) => {
    const nam = bot.emojis.find(emoji => emoji.name === 'NaM');

    if (perm === undefined) return message.reply(`You haven't set a mod in this server ${nam}. To set a mod in this server do $help setmod.`);
    if (!perm) return message.reply(`You don't have permission for this command ${nam}`);
    if (cmdFile && cmd.startsWith(prefix)) cmdFile.run(message, args);
    if (cmdFile.conf.cooldown > 0) cmdFile.startCooldown(message.author.id);
  });
};
