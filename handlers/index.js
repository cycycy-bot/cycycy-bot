const kick = require('./guildMemberRemove');
const onMessageDelete = require('./messageDelete');
const onGuildMemberAdd = require('./guildMemberAdd');
const onMessageUpdate = require('./onMessageEdit');

module.exports = {
  kick,
  onMessageDelete,
  onGuildMemberAdd,
  onMessageUpdate,
};
