const mongoose = require('mongoose');
const Notify = require('../../models/notifyDB');

module.exports.run = async (bot, message, args, NaM) => {
  const notifyUser = message
    .guild
    .member(message
      .mentions
      .users
      .first()
    || message
      .guild
      .members
      .get(args[0]));
  if (args[0] === 'help') {
    message
      .channel
      .send('```Usage: $notify <user> <message>```');
    return;
  }
  const notifyMsg = args.join(' ').slice(22);
  if (!notifyUser) {
    return message
      .channel
      .send(`User not found in server ${NaM}`);
  }
  if (!notifyMsg) {
    return message
      .channel
      .send(`Please add a message ${NaM}`);
  }

  const notify = new Notify({
    _id: mongoose.Types.ObjectId(),
    username: notifyUser.user.username,
    userID: notifyUser.id,
    senderName: message.author.username,
    senderAvatar: message.member.user.avatarURL,
    serverName: message.guild.name,
    notifyMsg,
    msgUrl: message.url,
    date: new Date(),
  });

  Notify.find({ userID: notifyUser.id }).then((results) => {
    if (results.length >= 5) { // message limiter
      return message.reply(`${notifyUser} has already reached the limit of recieving messages ${NaM}`);
    }
    notify
      .save()
      .then(() => message
        .reply(`${notifyUser} will be notified: ${notifyMsg}`))
      .catch(err => message.reply(`Error ${err}`));
  });
};

module.exports.help = {
  name: 'notify',
};
