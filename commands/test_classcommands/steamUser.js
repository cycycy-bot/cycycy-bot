const SteamUser = require('steam-user');
const Command = require('../../base/Command');

class SteamUserCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'steamuser',
      description: 'Shows the bot stats',
      usage: '$stats',
      permission: 'ADMINISTRATOR',
      cooldown: 1000,
    });
  }

  async run(message, args) {
    const client = new SteamUser();

    const logOnOptions = {
      accountName: 'cyryllsmurf',
      password: 'cpol2ghemmw',
    };

    client.logOn(logOnOptions);

    client.on('loggedOn', () => {
      console.log();
      // client.setPersona(SteamUser.EPersonaState.Online);
      // client.gamesPlayed(440); // team fortress game code
    });
  }
}

module.exports = SteamUserCommand;
