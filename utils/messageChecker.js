const Discord = require('discord.js');
const cleverbot = require('cleverbot-free');

const handleMessage = (bot, message, cmd, prefix) => {
  const nam = bot.emojis.cache.find(emoji => emoji.name === 'NaM');
  const omgScoots = '<:OMGScoots:669029552495788082>';
  const weirdChamp = bot.emojis.cache.find(emoji => emoji.name === 'WeirdChamp');

  // Custom command checker
  if (cmd.startsWith(prefix)) {
    const cmdChk = cmd.slice(prefix.length);
    cb.db.Cmd.findOne({
      serverID: message.guild.id,
      commandName: {
        $regex: new RegExp(`^${cmdChk.toLowerCase()}$`, 'i'),
      },
    }).then((res) => {
      if (res) {
        return message.channel.send(res.commandRes);
      }
    }).catch(err => console.log(err));
  }

  // Banphrase checker
  cb.db.BanPhrase.find({ serverID: message.guild.id }).then((res) => {
    if (cmd === `${prefix}addbanphrase` || cmd === `${prefix}delbanphrase`) return;
    res.forEach((bp) => {
      if (message.content.toLowerCase().includes(bp.banphrase.toLowerCase())) {
        return message.delete()
          .then(
            message.reply(`Your message matched the ban phrase in this server ${weirdChamp}`),
          ).catch(console.log);
      }
    });
  }).catch(console.log);

  // AFK checker
  cb.db.Afk.findOne({ userID: message.author.id }).then(async (result) => {
    if (result) {
      const newTime = new Date();
      const ms = newTime - result.date;
      let totalSecs = (ms / 1000);
      const hours = Math.floor(totalSecs / 3600);
      totalSecs %= 3600;
      const minutes = Math.floor(totalSecs / 60);
      const seconds = totalSecs % 60;

      if (hours === 0 && minutes < 30 && result.tucker) {
        return cb.db.Afk.deleteOne({ userID: result.userID })
          .then(console.log(`${message.author.username} was tucked by ${result.tucker} and came back ${minutes} minutes later ${weirdChamp}`))
          .catch(console.log);
      }
      const notifyEmbed = new Discord.MessageEmbed()
        .setTitle(`${message.author.username} is back (${hours}h, ${minutes}m and ${Math.trunc(seconds)}s ago)`)
        .setColor('#4e1df2');
      await cb.db.Notify.find({ userID: message.author.id }).then((notifyResult) => {
        if (notifyResult.length >= 1) {
          notifyResult.forEach((resData) => {
            const { msgUrl } = resData;
            notifyEmbed
              .addFields({ name: `${resData.senderName}'s message from ${resData.serverName} server:`, value: `[Click here](${msgUrl})`, inline: true });
            cb.db.Notify.deleteOne({ userID: resData.userID })
              .then(console.log('Message Deleted'))
              .catch(console.log);
          });
        }
      });
    }
  });

  // AFK Tagged checker
  cb.db.Afk.find({}).then((afkRes) => {
    afkRes.forEach((res) => {
      if (message.mentions.has(res.userID)) {
        console.log(res);
        if (cmd.startsWith(prefix)) return;
        const notifyUser = message.guild.members.cache.get(res.userID);

        const notify = new cb.db.Notify({
          _id: cb.db.mongoose.Types.ObjectId(),
          username: notifyUser.user.username,
          userID: res.userID,
          senderName: message.author.username,
          senderAvatar: message.member.user.avatarURL(),
          serverName: message.guild.name,
          notifyMsg: message.content,
          msgUrl: message.url,
          date: new Date(),
        });

        cb.db.Notify.find({ userID: res.userID }).then((notifyRes) => {
          // message limiter
          if (notifyRes.length >= 3) {
            return message.reply(`${notifyUser.user.username} has already reached the limit of recieving messages ${nam}`);
          }
          return notify.save()
            .then(() => {
              message.reply(`${notifyUser.user.username} is afk but i will send them that message when they type in any server im on ${omgScoots} 👍`);
            })
            .catch(console.log);
        });
      }
    });
  }).catch(console.log);

  // if bot is mentioned
  if (message.mentions.has(bot.user, { ignoreDirect: false, ignoreRoles: false, ignoreEveryone: true })) {
    const messageArray = message.content.split(' ');
    const args = messageArray.slice(1);
    const joinedArgs = args.join(' ');

    if (!joinedArgs) {
      return message.reply('<:ForsenLookingAtYou:746755500229787778>');
    }
    return cleverbot(joinedArgs).then((res) => {
      message.reply(res);
    });
  }
  // get rid of weebs NaM
  cb.db.AntiWeeb.findOne({ serverID: message.guild.id }).then((res) => {
    if (res) {
      if (res.isEnabled) {
        if (message.content.toUpperCase().includes('AYAYA')) {
          // weeb dungeon
          if (message.channel.id === '500399188627161109' || message.channel.id === '579333258999889981' || message.content.includes('cycycyAYAYA')) return;
          const DansGame = bot.emojis.find(emoji => emoji.name === 'DansGame');
          message.channel.send(`${DansGame.toString()} :point_right: :door:`);
          message.channel.send('WEEBS OUT');
          message.react(DansGame.id)
            .then(() => {
              message.react('👉')
                .then(() => {
                  message.react('🚪').catch(console.log);
                }).catch(console.log);
            }).catch(console.log);
        }
      }
    }
  });

  // type
  if (message.isMentioned(bot.user)) {
    const msgArr = [
      `What ${weirdChamp} ❓`,
      `Stop tagging me ${weirdChamp}`,
      `What do you want ${weirdChamp}`,
      `Are you actually tagging me ${weirdChamp}`,
    ];
    message.channel.startTyping(100);
    setTimeout(() => {
      message.reply(msgArr[Math.floor(Math.random() * msgArr.length)]);
      return message.channel.stopTyping(true);
    }, 2000);
  }
};

module.exports = {
  handleMessage,
};
