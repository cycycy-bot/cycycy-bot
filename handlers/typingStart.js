module.exports = (bot, channel, user) => {
  if (channel.name === 'general' && user.id === '216752284791603202') {
    bot.channels.cache
      .get(channel.id)
      .send('ambulung is typing in general <a:docLeave:776882312830124082>');
  }
};
