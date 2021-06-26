const Command = require('../../base/Command');

class FilterBanUser extends Command {
  constructor(bot) {
    super(bot, {
      name: 'filterbanuser',
      description: 'Gives Shoutout to a streamer',
      usage: '$fbu <add/del> <username>',
      aliases: ['fbu'],
      permission: 'mod',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const { mongoose, TwitchUser } = cb.db;
    const addOrDel = args[0];
    const twitchUser = args[1];
    if (!addOrDel) return this.bot.say(message.channelName, `Please add a command name`);
    if (!twitchUser) return this.bot.say(message.channelName, `Please add a twitch user`);

    const tUser = new TwitchUser({
      _id: mongoose.Types.ObjectId(),
      username: twitchUser,
      channel: message.channelID,
    });

    const user = await TwitchUser.findOne({ channel: message.channelID, username: twitchUser });
    if (addOrDel === "add") {
      if (!user) {
        return tUser.save();
      }
      return this.bot.say(message.channelName, `User already banned`);
    }
    if (addOrDel === "del") {
      const delUser = await TwitchUser.deleteOne({ channel: message.channelID, username: twitchUser });
      if (delUser.n >= 1) {
        return this.bot.say(message.channelName, `User unbanned from filter`);
      }
      this.bot.say(message.channelName, `User isn't banned`);
    }
  }
}

module.exports = FilterBanUser;
