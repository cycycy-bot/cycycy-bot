const mongoose = require('mongoose');
const Afk = require('../../models/afkDB');

module.exports.run = async (bot, message, args, NaM) => {
  const reason = args.join(' ');
  if (args[0] === 'help') {
    message.reply('```Usage: $afk <message>```');
    return;
  }
  const afk = new Afk({
    _id: mongoose.Types.ObjectId(),
    userID: message.author.id,
    userName: message.author.username,
    reason,
    date: new Date(),
    afkType: 'afk',
  });

  Afk.find({ userID: message.author.id }).then((res) => {
    if (res.length >= 1) { // afk limiter
      return message.reply(`You are already AFK ${NaM}`);
    }
    afk
      .save()
      .then(message
        .reply(`is now AFK: ${reason}`))
      .catch(err => message.reply(`Error ${err}`));
  });
};

module.exports.help = {
  name: 'afk',
};
