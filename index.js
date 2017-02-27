const co = require('co');
const token = require('./config/secrets');
const parseCards = require('./util/parse-cards');
const SlackBot = require('slackbots');
const { Renderer, Serializer } = require('mtg-card-renderer');
const { MongoClient } = require('mongodb');

const name = 'Jace';
const icon_emoji = ':jace:';

co(function*() {

  const bot = new SlackBot({ token, name });
  const db = yield MongoClient.connect('mongodb://localhost:27017/mtg');
  const collection = db.collection('cards');

  const template = (id) => {
    return `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${id}&type=card`;
  }

  const compile = co.wrap(function*(message, name) {
    console.log(message);
    let { multiverseid } = yield collection.findOne({ name });
    return message + `\n${template(multiverseid)}`;
  });

  const fn = co.wrap(function*(data) {
    let { channel, ts: thread_ts, type, text } = data;
    if (type === 'message' && text) {
      console.log('=============================================');
      let matches = parseCards(text);
      console.log(matches);
      if (matches.length) {
        matches.reduce(compile, '').then((response) => {
          bot.postMessage(channel, response, { thread_ts, icon_emoji });
        }, (error) => {
          console.log('ERROR!');
          console.log(error);
        });
      }
      console.log('=============================================');
    }
  });

  bot.on('message', fn);
});