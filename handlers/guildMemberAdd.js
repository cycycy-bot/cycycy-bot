const bot = require('../bot');
const db = require('../settings/databaseImport');

bot.on('guildMemberAdd', (member) => {
  db.Welcome.findOne({ serverID: member.guild.id }).then((res) => {
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
});
