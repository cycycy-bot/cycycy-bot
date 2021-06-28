const Filter = require('bad-words');
const Command = require('../../base/Command');

const filter = new Filter({ placeHolder: '*' });

class RandomLine extends Command {
  constructor(bot) {
    super(bot, {
      name: 'rl',
      description: 'Random line from cycycy\'s twitch chat logs',
      usage: '$rl <twitch_user>',
      cooldown: 1000,
    });
  }

  getDate(oldDate) {
    const newTime = new Date();
    const ms = newTime - oldDate;
    let totalSecs = (ms / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor(totalSecs / 3600);
    totalSecs %= 3600;
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }

  async isBanned(channel, user) {
    const { TwitchUser } = cb.db;
    console.log({ channel, username: user.toLowerCase() });
    const bannedUser = await TwitchUser.findOne({ channel, username: user.toLowerCase() });
    if (bannedUser) {
      return true;
    }
    return false;
  }

  async isBanphrase(message) {
    const URL = 'https://lacari.live/api/v1/banphrases/test';
    const res = await cb.fetch(URL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    });
    const json = await res.json();
    return json.banned;
  }

  async run(message, args) {
    const nam = 'NaM';
    const clean = msg => msg.replace(/[^a-z0-9+_-]+/gi, '');
    const { TwitchLog } = cb.db;

    const twitchUser = args[0];
    const twitchChannel = args[1];

    if (!twitchUser) {
      const res = await TwitchLog.aggregate([
        { $sample: { size: 1 } },
      ]);
      const bannedUser = await this.isBanned(message.channelID, clean(res[0].userName));
      if (bannedUser) return this.bot.say(message.channelName, `User is banned`);

      const resMessage = res[0].message;
      const isBanphrase = await this.isBanphrase(resMessage);
      if (isBanphrase) return this.bot.say(message.channelName, `Message banphrase`);

      const date = this.getDate(res[0].date);
      const hasAscii = /[^\x20-\x7E]/g.test(resMessage);

      console.log(resMessage);

      this.bot.say(message.channelName, date.days > 0 ? `(${date.days}days ago in ${res[0].channel}) ${hasAscii ? 'contains ASCII characters' : filter.clean(resMessage)}`
        : `(${date.hours}hrs, ${date.minutes}m ${Math.trunc(date.seconds)}s ago in ${res[0].channel}) ${hasAscii ? 'contains ASCII characters' : filter.clean(resMessage)}`);
      return;
    }

    if (twitchChannel) {
      const res = await TwitchLog.aggregate([
        { $match: { userName: clean(twitchUser.toLowerCase()), channel: twitchChannel.toLowerCase() } },
        { $sample: { size: 1 } },
      ]);
      if (!res.length) return this.bot.say(message.channelName, `Twitch user/channel not found in my DB ${nam} Try $rl [username] [channel]`);
      const bannedUser = await this.isBanned(message.channelID, clean(res[0].userName));
      if (bannedUser) return this.bot.say(message.channelName, `User is banned`);

      const resMessage = res[0].message;
      const isBanphrase = await this.isBanphrase(resMessage);
      if (isBanphrase) return this.bot.say(message.channelName, `Message banphrase`);

      const date = this.getDate(res[0].date);
      const hasAscii = /[^\x20-\x7E]/g.test(resMessage);

      console.log(resMessage);

      this.bot.say(message.channelName, date.days > 0 ? `(${date.days}days ago in ${res[0].channel}) ${hasAscii ? 'contains ASCII characters' : filter.clean(resMessage)}`
        : `(${date.hours}hrs, ${date.minutes}m ${Math.trunc(date.seconds)}s ago in ${res[0].channel}) ${hasAscii ? 'contains ASCII characters' : filter.clean(resMessage)}`);
      return;
    }

    const bannedUser = await this.isBanned(message.channelID, clean(twitchUser));
    if (bannedUser) return this.bot.say(message.channelName, `User is banned`);

    const res = await TwitchLog.aggregate([
      { $match: { userName: clean(twitchUser.toLowerCase()) } },
      { $sample: { size: 1 } },
    ]);
    if (!res.length) return this.bot.say(message.channelName, `Twitch user not found in my DB ${nam} Try $rl [username]`);
    const resMessage = res[0].message;
    const isBanphrase = await this.isBanphrase(resMessage);
    if (isBanphrase) return this.bot.say(message.channelName, `Message banphrase`);

    const date = this.getDate(res[0].date);
    const hasAscii = /[^\x20-\x7E]/g.test(resMessage);

    this.bot.say(message.channelName, date.days > 0 ? `(${date.days}days ago in ${res[0].channel}) ${hasAscii ? 'contains ASCII characters' : filter.clean(resMessage)}`
      : `(${date.hours}hrs, ${date.minutes}m ${Math.trunc(date.seconds)}s ago in ${res[0].channel}) ${hasAscii ? 'contains ASCII characters' : filter.clean(resMessage)}`);
  }
}

module.exports = RandomLine;
