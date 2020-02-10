
const Discord = require('discord.js');
const Canvas = require('canvas');
const fetch = require('node-fetch');

const checkImage = (src, good, bad) => {
  const img = new Canvas.Image();
  img.onload = good;
  img.onerror = bad;
  img.src = src;
  console.log(img);
};

module.exports.run = async (bot, message, args, NaM) => {
  const emoteUrl = args[0];
  const emoteName = args[1];
  if (!emoteUrl) return message.reply(`Please add a valid image URL ${NaM}`);
  if (!emoteName) return message.reply(`Please add an emote name after the URL ${NaM}`);
  checkImage(emoteUrl, () => {

  }, () => message.reply(`The link doesn't have a valid image that Discord supports ${NaM} only jpeg, jpg, gif and png.`));
};

module.exports.help = {
  name: 'voteemote',
};
