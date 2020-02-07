const db = require('../settings/databaseImport');


module.exports = (bot, member) => {
  db.Welcome.findOne({ serverID: member.guild.id }).then((res) => {
    if (!res) return; // silently do nothing if disabled
    const {
      isEnabled,
      welcomeChannel,
      welcomeMsg,
    } = res;

    const user = welcomeMsg.replace('{user}', `<@${member.id}>`);
    if (isEnabled) {
      bot.channels.get(welcomeChannel).send(user);
    }
  });
};
