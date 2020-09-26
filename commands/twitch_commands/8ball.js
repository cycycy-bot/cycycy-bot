const Command = require('../../base/Command');

class EightBall extends Command {
  constructor(bot) {
    super(bot, {
      name: '8ball',
      description: '8-ball',
      usage: '$8ball <question>',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const doRandomAnswer = () => {
      const rand = [
        'Yes :)',
        'No :)',
        'No, I don\'t think so NOIDONTTHINKSO',
        'YEP that\'s a cock 😂 ',
        'NOP',
        'What do you think?',
        'Maybe :)',
        'LOOOOOOL 4Head',
        'HAHAHAHAHA that\'s seems like an OMEGALUL for me ZULUL',
        'No Kappa',
        'Seems like it KappaPride',
        'Im not aware PepeLaugh',
        'My sources say no LuL',
        'LUL',
      ];
      return rand[Math.floor(Math.random() * rand.length)];
    };

    this.bot.say(message.channelName, `@${message.senderUsername}, the 8-ball says... ${doRandomAnswer()}`);
  }
}

module.exports = EightBall;
