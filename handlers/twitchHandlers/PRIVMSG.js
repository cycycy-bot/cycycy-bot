const { mongoose, TwitchLog, Afk } = cb.db;

module.exports = (bot, message) => {
  // console.log(message);
  if (message.senderUsername === bot.configuration.username) return;
  const twitchMsg = new TwitchLog({
    _id: mongoose.Types.ObjectId(),
    userID: message.senderUserID,
    userName: message.senderUsername,
    channel: message.channelName,
    message: message.messageText,
    date: new Date(),
  });
  twitchMsg.save();

  // donker
  if (message.channelName === 'cycycy') {
    const donks = ['donk', 'feelsdankman', 'feelsdonkman'];

    if (donks.some(donk => message.messageText.toLowerCase().includes(donk.toLowerCase()))) {
      if (bot.cooldown.has(message.senderUserID)) return;
      bot.say(message.channelName, 'FeelsDonkMan 👍 ');
      bot.cooldown.add(message.senderUserID);

      setTimeout(() => {
        bot.cooldown.delete(message.senderUserID);
      }, 10000);
    }

    // trihard
    const trihards = ['trihard', 'widehardo'];
    if (trihards.some(tri => message.messageText.toLowerCase().includes(tri.toLowerCase()))) {
      if (bot.cooldown.has(message.senderUserID)) return;
      bot.say(message.channelName, 'TriHard 7');
      bot.cooldown.add(message.senderUserID);

      setTimeout(() => {
        bot.cooldown.delete(message.senderUserID);
      }, 10000);
    }

    // pepege
    const pepege = ['pepega', 'pepege'];
    if (pepege.some(pepeg => message.messageText.toLowerCase().includes(pepeg.toLowerCase()))) {
      if (bot.cooldown.has(message.senderUserID)) return;
      bot.say(message.channelName, 'Pepege Clap');
      bot.cooldown.add(message.senderUserID);

      setTimeout(() => {
        bot.cooldown.delete(message.senderUserID);
      }, 10000);
    }
  }

  // AFK handler
  Afk.findOne({ userID: message.senderUserID }).then((result) => {
    if (!result) return;
    const newTime = new Date();
    const ms = newTime - result.date;
    let totalSecs = (ms / 1000);
    const hours = Math.floor(totalSecs / 3600);
    totalSecs %= 3600;
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;

    bot.say(message.channelName, `${message.senderUsername} is back (${hours}h, ${minutes}m and ${Math.trunc(seconds)}s ago)${result.reason ? `: ${result.reason}` : null}`);
    return Afk.deleteOne({ userID: result.userID })
      .then(console.log(`${message.senderUsername} is back (${hours}h, ${minutes}m and ${Math.trunc(seconds)}s ago)`))
      .catch(console.log);
  });

  // COMMANDS
  const { prefix } = bot.config;
  const messageArray = message.messageText.split(' ');
  const cmd = messageArray[0].toLowerCase();
  const args = messageArray.slice(1);


  // call command handler
  const cmdFile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));

  // return if command is not found
  if (!cmdFile) return;
  // return if command doesnt start with prefix
  if (!cmd.startsWith(prefix)) return;

  if (cmdFile.cooldown.has(message.senderUserID)) return;

  cmdFile.setMessage(message);
  cmdFile.hasTwitchPermission().then((perm) => {
    if (!perm) return;
    if (cmdFile && cmd.startsWith(prefix))cmdFile.run(message, args);
    if (cmdFile.conf.cooldown > 0) cmdFile.startCooldown(message.senderUserID);
    console.log(`${new Date().toLocaleString()}: ${cmdFile.help.name} used by ${message.senderUsername} in ${message.channelName}`);
  });
};
