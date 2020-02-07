const Discord = require('discord.js');

const handleMessage = (bot, message, cmd, prefix, db, weirdChamp, NaM, OMGScoots) => {
  // Custom command checker
  if (cmd.startsWith(prefix)) {
    const cmdChk = cmd.slice(prefix.length);
    db.Cmd.findOne({
      serverID: message.guild.id,
      commandName: {
        $regex: new RegExp(`^${cmdChk.toLowerCase()}`, 'i'),
      },
    }).then((res) => {
      if (res) {
        return message.channel.send(res.commandRes);
      }
    }).catch(err => console.log(err));
  }

  // Banphrase checker
  db.BanPhrase.find({ serverID: message.guild.id }).then((res) => {
    res.forEach((bp) => {
      if (message.content.toUpperCase().includes(bp.banphrase.toUpperCase())) {
        return message.delete()
          .then(
            message
              .reply(`Your message matched the ban phrase in this server ${weirdChamp}`),
          ).catch(console.log);
      }
    });
  }).catch(console.log);

  // AFK checker
  db.Afk.findOne({ userID: message.author.id }).then((result) => {
    if (result) {
      const newTime = new Date();
      const ms = newTime - result.date;
      let totalSecs = (ms / 1000);
      const hours = Math.floor(totalSecs / 3600);
      totalSecs %= 3600;
      const minutes = Math.floor(totalSecs / 60);
      const seconds = totalSecs % 60;

      const backEmbed = new Discord.RichEmbed()
        .setTitle(`${message.author.username} is back (${hours}h, ${minutes}m and ${Math.trunc(seconds)}s ago)`)
        .addField('Message: ', result.reason || 'null')
        .setColor(message.guild.member(message.author).highestRole.color);
      if (result.afkType === 'gn') backEmbed.setFooter(`tucked by ${result.tucker || 'no one PepeHands'}`);

      message.channel.send(backEmbed);
      return db.Afk.deleteOne({ userID: result.userID }).then(console.log('Message Deleted')).catch(console.log);
    }
  });

  // AFK Tagged checker
  db.Afk.find({}).then((afkRes) => {
    afkRes.forEach((res) => {
      if (message.isMentioned(res.userID)) {
        if (cmd.startsWith(prefix)) return;
        const notifyUser = message.mentions.users.find(user => user.id === res.userID);

        const notify = new db.Notify({
          _id: db.mongoose.Types.ObjectId(),
          username: notifyUser.username,
          userID: res.userID,
          senderName: message.author.username,
          senderAvatar: message.member.user.avatarURL,
          serverName: message.guild.name,
          notifyMsg: message.content,
          msgUrl: message.url,
          date: new Date(),
        });

        db.Notify.find({ userID: res.userID }).then((notifyRes) => {
          if (notifyRes.length >= 3) { // message limiter
            return message.reply(`${notifyUser.username} has already reached the limit of recieving messages ${NaM}`);
          }
          return notify.save().then(() => message.reply(`${notifyUser.username} is afk but i will send them that message when they type in any server im on ${OMGScoots} 👍`)).catch(console.log);
        });
      }
    });
  }).catch(console.log);


  // Notify checker
  db.Notify.find({ userID: message.author.id }).then((result) => {
    if (result.length >= 1) {
      message.reply(`You have notifications ${NaM}`);

      result.forEach((resData) => {
        const newTime = new Date();
        const ms = newTime - resData.date;
        let totalSecs = (ms / 1000);
        const hours = Math.floor(totalSecs / 3600);
        totalSecs %= 3600;
        const minutes = Math.floor(totalSecs / 60);
        const seconds = totalSecs % 60;

        const notifyEmbed = new Discord.RichEmbed()
          .setColor('#4e1df2')
          .setAuthor(`${resData.senderName} sent you a message from ${resData.serverName} server:`, resData.senderAvatar)
          .setTitle('Click here for message link')
          .setURL(resData.msgUrl)
          .addField(`Message (${hours}h, ${minutes}m and ${Math.trunc(seconds)}s ago): `, resData.notifyMsg);
        return message.channel.send(notifyEmbed)
          .then(() => {
            db.Notify.deleteOne({ userID: resData.userID }).then(console.log('Message Deleted')).catch(console.log);
          })
          .catch(console.log);
      });
    }
  });

  // get rid of weebs NaM
  db.AntiWeeb.findOne({ serverID: message.guild.id }).then((res) => {
    if (res) {
      if (res.isEnabled) {
        if (message.content.toUpperCase().includes('AYAYA')) {
          if (message.channel.id === '500399188627161109' || message.channel.id === '579333258999889981' || message.content.includes('cycycyAYAYA')) return; // weeb dungeon
          const DansGame = bot.emojis.find(emoji => emoji.name === 'DansGame');
          message.channel.send(`${DansGame.toString()} :point_right: :door:`);
          message.channel.send('WEEBS OUT');
          message.react(DansGame.id).then(() => {
            message.react('👉').then(() => {
              message.react('🚪').catch(console.log);
            }).catch(console.log);
          }).catch(console.log);
        }
      }
    }
  });
};

module.exports = {
  handleMessage,
};
