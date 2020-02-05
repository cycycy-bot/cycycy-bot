const scheduler = require('node-schedule');

module.exports.run = ({ args }) => {
  console.log(args);
};

module.exports.help = {
  name: 'remindme',
};
