const mongoose = require('mongoose');
const Notify = require('../models/notifyDB');
const Afk = require('../models/afkDB');
const Cmd = require('../models/customCommandsDB');
const BanPhrase = require('../models/banPhraseDB');
const Logger = require('../models/loggerDB');
const Welcome = require('../models/welcomeDB');
const AntiWeeb = require('../models/antiweebDB');
const Mod = require('../models/modDBtest');
const Pedo = require('../models/pedoModDB');
const TwitchLog = require('../models/twitchLog');
const Timeout = require('../models/timeoutDB');
const CookieDB = require('../models/cookieDB');

module.exports = {
  mongoose,
  Notify,
  Afk,
  Cmd,
  BanPhrase,
  Logger,
  Welcome,
  AntiWeeb,
  Mod,
  Pedo,
  TwitchLog,
  Timeout,
  CookieDB,
};
