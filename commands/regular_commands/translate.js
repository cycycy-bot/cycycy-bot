const Discord = require('discord.js');
const translate = require('@vitalets/google-translate-api');

const langs = {
  auto: 'Automatic',
  af: 'Afrikaans',
  sq: 'Albanian',
  am: 'Amharic',
  ar: 'Arabic',
  hy: 'Armenian',
  az: 'Azerbaijani',
  eu: 'Basque',
  be: 'Belarusian',
  bn: 'Bengali',
  bs: 'Bosnian',
  bg: 'Bulgarian',
  ca: 'Catalan',
  ceb: 'Cebuano',
  ny: 'Chichewa',
  zh: 'Chinese (Simplified)',
  'zh-cn': 'Chinese (Simplified)',
  'zh-tw': 'Chinese (Traditional)',
  co: 'Corsican',
  hr: 'Croatian',
  cs: 'Czech',
  da: 'Danish',
  nl: 'Dutch',
  en: 'English',
  eo: 'Esperanto',
  et: 'Estonian',
  tl: 'Filipino',
  fi: 'Finnish',
  fr: 'French',
  fy: 'Frisian',
  gl: 'Galician',
  ka: 'Georgian',
  de: 'German',
  el: 'Greek',
  gu: 'Gujarati',
  ht: 'Haitian Creole',
  ha: 'Hausa',
  haw: 'Hawaiian',
  he: 'Hebrew',
  iw: 'Hebrew',
  hi: 'Hindi',
  hmn: 'Hmong',
  hu: 'Hungarian',
  is: 'Icelandic',
  ig: 'Igbo',
  id: 'Indonesian',
  ga: 'Irish',
  it: 'Italian',
  ja: 'Japanese',
  jw: 'Javanese',
  kn: 'Kannada',
  kk: 'Kazakh',
  km: 'Khmer',
  ko: 'Korean',
  ku: 'Kurdish (Kurmanji)',
  ky: 'Kyrgyz',
  lo: 'Lao',
  la: 'Latin',
  lv: 'Latvian',
  lt: 'Lithuanian',
  lb: 'Luxembourgish',
  mk: 'Macedonian',
  mg: 'Malagasy',
  ms: 'Malay',
  ml: 'Malayalam',
  mt: 'Maltese',
  mi: 'Maori',
  mr: 'Marathi',
  mn: 'Mongolian',
  my: 'Myanmar (Burmese)',
  ne: 'Nepali',
  no: 'Norwegian',
  ps: 'Pashto',
  fa: 'Persian',
  pl: 'Polish',
  pt: 'Portuguese',
  pa: 'Punjabi',
  ro: 'Romanian',
  ru: 'Russian',
  sm: 'Samoan',
  gd: 'Scots Gaelic',
  sr: 'Serbian',
  st: 'Sesotho',
  sn: 'Shona',
  sd: 'Sindhi',
  si: 'Sinhala',
  sk: 'Slovak',
  sl: 'Slovenian',
  so: 'Somali',
  es: 'Spanish',
  su: 'Sundanese',
  sw: 'Swahili',
  sv: 'Swedish',
  tg: 'Tajik',
  ta: 'Tamil',
  te: 'Telugu',
  th: 'Thai',
  tr: 'Turkish',
  uk: 'Ukrainian',
  ur: 'Urdu',
  uz: 'Uzbek',
  vi: 'Vietnamese',
  cy: 'Welsh',
  xh: 'Xhosa',
  yi: 'Yiddish',
  yo: 'Yoruba',
  zu: 'Zulu',
};

const langsReversed = {
  Automatic: 'auto',
  Afrikaans: 'af',
  Albanian: 'sq',
  Amharic: 'am',
  Arabic: 'ar',
  Armenian: 'hy',
  Azerbaijani: 'az',
  Basque: 'eu',
  Belarusian: 'be',
  Bengali: 'bn',
  Bosnian: 'bs',
  Bulgarian: 'bg',
  Catalan: 'ca',
  Cebuano: 'ceb',
  Chichewa: 'ny',
  'Chinese-S': 'zh',
  'Chinese-T': 'zh-tw',
  Corsican: 'co',
  Croatian: 'hr',
  Czech: 'cs',
  Danish: 'da',
  Dutch: 'nl',
  English: 'en',
  Esperanto: 'eo',
  Estonian: 'et',
  Filipino: 'tl',
  Finnish: 'fi',
  French: 'fr',
  Frisian: 'fy',
  Galician: 'gl',
  Georgian: 'ka',
  German: 'de',
  Greek: 'el',
  Gujarati: 'gu',
  'Haitian-Creole': 'ht',
  Hausa: 'ha',
  Hawaiian: 'haw',
  Hebrewh: 'he',
  Hebrewi: 'iw',
  Hindi: 'hi',
  Hmong: 'hmn',
  Hungarian: 'hu',
  Icelandic: 'is',
  Igbo: 'ig',
  Indonesian: 'id',
  Irish: 'ga',
  Italian: 'it',
  Japanese: 'ja',
  Javanese: 'jw',
  Kannada: 'kn',
  Kazakh: 'kk',
  Khmer: 'km',
  Korean: 'ko',
  Kurdish: 'ku',
  Kyrgyz: 'ky',
  Lao: 'lo',
  Latin: 'la',
  Latvian: 'lv',
  Lithuanian: 'lt',
  Luxembourgish: 'lb',
  Macedonian: 'mk',
  Malagasy: 'mg',
  Malay: 'ms',
  Malayalam: 'ml',
  Maltese: 'mt',
  Maori: 'mi',
  Marathi: 'mr',
  Mongolian: 'mn',
  Burmese: 'my',
  Nepali: 'ne',
  Norwegian: 'no',
  Pashto: 'ps',
  Persian: 'fa',
  Polish: 'pl',
  Portuguese: 'pt',
  Punjabi: 'pa',
  Romanian: 'ro',
  Russian: 'ru',
  Samoan: 'sm',
  'Scots-Gaelic': 'gd',
  Serbian: 'sr',
  Sesotho: 'st',
  Shona: 'sn',
  Sindhi: 'sd',
  Sinhala: 'si',
  Slovak: 'sk',
  Slovenian: 'sl',
  Somali: 'so',
  Spanish: 'es',
  Sundanese: 'su',
  Swahili: 'sw',
  Swedish: 'sv',
  Tajik: 'tg',
  Tamil: 'ta',
  Telugu: 'te',
  Thai: 'th',
  Turkish: 'tr',
  Ukrainian: 'uk',
  Urdu: 'ur',
  Uzbek: 'uz',
  Vietnamese: 'vi',
  Welsh: 'cy',
  Xhosa: 'xh',
  Yiddish: 'yi',
  Yoruba: 'yo',
  Zulu: 'zu',
};

module.exports.run = async (bot, message, args, NaM) => {
  if (args[0] === 'help') {
    return message
      .channel
      .send('```Usage: $translate <message> or $translate to <language> <message>```');
  }
  if (!args[0]) return message.reply(`Please add arguments ${NaM}`);

  bot
    .cooldown
    .add(message.author.id);
  setTimeout(() => {
    bot.cooldown.delete(message.author.id);
  }, 15000);

  if (args[0].includes('to')) {
    if (!args[1]) {
      message.reply(`Please add a language to translate from english ${NaM}`);
      const languages = new Discord.RichEmbed()
        .addField('languages', 'Automatic: \'auto\' \n Afrikaans: \'af\' \n Albanian: \'sq\' \n Amharic: \'am\' \n Arabic: \'ar\' \n Armenian: \'hy\' \n Azerbaijani: \'az\' \n Basque: \'eu\' \n Belarusian: \'be\' \n Bengali: \'bn\' \n Bosnian: \'bs\', \n Bulgarian: \'bg\' \n Catalan: \'ca\' \n Cebuano: \'ceb\' \n Chichewa: \'ny\' \n \'Chinese-S\': \'zh\' \n \'Chinese-T\': \'zh-tw\' \n Corsican: \'co\' \n Croatian: \'hr\' \n Czech: \'cs\' \n Danish: \'da\' \n Dutch: \'nl\' \n English: \'en\' \n Esperanto: \'eo\' \n Estonian: \'et\' \n Filipino: \'tl\' \n Finnish: \'fi\' \n French: \'fr\' \n Frisian: \'fy\' \n Galician: \'gl\' \n Georgian: \'ka\' \n German: \'de\' \n Greek: \'el\' \n Gujarati: \'gu\' \n \'Haitian-Creole\': \'ht\' \n', true)
        .addField('⠀', ' Hausa: \'ha\' \n Hawaiian: \'haw\' \n Hebrewh: \'he\' \n Hebrewi: \'iw\' \n Hindi: \'hi\' \n Hmong: \'hmn\' \n Hungarian: \'hu\' \n Icelandic: \'is\' \n Igbo: \'ig\' \n Indonesian: \'id\' \n Irish: \'ga\' \n Italian: \'it\' \n Japanese: \'ja\' \n Javanese: \'jw\' \n Kannada: \'kn\' \n Kazakh: \'kk\' \n Khmer: \'km\' \n Korean: \'ko\' \n Kurdish: \'ku\' \n Kyrgyz: \'ky\' \n Lao: \'lo\' \n Latin: \'la\' \n Latvian: \'lv\' \n Lithuanian: \'lt\' \n Luxembourgish: \'lb\' \n Macedonian: \'mk\' \n Malagasy: \'mg\' \n Malay: \'ms\' \n Malayalam: \'ml\' \n Maltese: \'mt\' \n Maori: \'mi\' \n Marathi: \'mr\' \n Mongolian: \'mn\' \n Burmese: \'my\' \n Nepali: \'ne\' \n Norwegian: \'no\' \n', true)
        .addField('⠀', 'Pashto: \'ps\' \n Persian: \'fa\' \n Polish: \'pl\' \n Portuguese: \'pt\' \n Punjabi: \'pa\' \n Romanian: \'ro\' \n Russian: \'ru\' \n Samoan: \'sm\' \n \'Scots-Gaelic\': \'gd\' \n Serbian: \'sr\' \n Sesotho: \'st\' \n Shona: \'sn\' \n Sindhi: \'sd\' \n Sinhala: \'si\' \n Slovak: \'sk\' \n Slovenian: \'sl\' \n Somali: \'so\' \n Spanish: \'es\' \n Sundanese: \'su\' \n Swahili: \'sw\' \n Swedish: \'sv\' \n Tajik: \'tg\' \n Tamil: \'ta\' \n Telugu: \'te\' \n Thai: \'th\' \n Turkish: \'tr\' \n Ukrainian: \'uk\' \n Urdu: \'ur\' \n Uzbek: \'uz\' \n Vietnamese: \'vi\' \n Welsh: \'cy\' \n Xhosa: \'xh\' \n Yiddish: \'yi\' \n Yoruba: \'yo\' \n Zulu: \'zu\' \n', true);
      return message.channel.send(languages);
    }
    const capitalized = args[1].charAt(0).toUpperCase() + args[1].slice(1);
    if (!langsReversed[capitalized]) return message.reply(`Language not found ${NaM}`);
    if (!args[2]) return message.reply(`Please add arguments ${NaM}`);

    const joinedArgs1 = args.slice(2).join(' ');
    const selectedLanguage = langsReversed[capitalized];

    return translate(joinedArgs1, { to: selectedLanguage }).then((res) => {
      console.log(res);
      const langEmbed = new Discord.RichEmbed()
        .setDescription('Translation')
        .setColor('#FFFFFF')
        .addField(`Translated to ${langs[selectedLanguage]}`, res.text)
        .addField('Translated from:', langs[res.from.language.iso]);

      message.channel.send(langEmbed);
    }).catch(err => message.reply(`Error ${err}`));
  }

  const joinedArgs = args.join(' ');
  translate(joinedArgs, { to: 'en' }).then((res) => {
    const langEmbed = new Discord.RichEmbed()
      .setDescription('Translation')
      .setColor('#FFFFFF')
      .addField('Translated to English:', res.text)
      .addField('Translated from:', langs[res.from.language.iso]);

    message.channel.send(langEmbed);
  }).catch(err => message.reply(`Error ${err}`));
};

module.exports.help = {
  name: 'translate',
};
