const co = require('co');
const token = require('./config/secrets');
const parseCards = require('./util/parse-cards');
const SlackBot = require('slackbots');
const { Renderer } = require('mtg-card-renderer');
const { MongoClient } = require('mongodb');

const name = 'Jace';
const icon_emoji = ':jace:';
const BOT_ID = 'B3YGGGQ4W';

co(function*() {

  const bot = new SlackBot({ token, name });
  const db = yield MongoClient.connect('mongodb://localhost:27017/mtg');
  const collection = db.collection('cards');

  const template = ({ multiverseid }) => {
    return `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${multiverseid}&type=card`;
  }

  const fn = co.wrap(function*(data) {
    let { channel, ts: thread_ts, type, text, bot_id } = data;

    if (bot_id === BOT_ID) {
      return;
    }

    if (type === 'message' && text) {
      let matches = parseCards(text);
      if (matches.length) {
        let cards = yield matches.map( name => collection.findOne({ name }) );
        let response = cards.map(Renderer).join('\n');
        bot.postMessage(channel, response, { thread_ts, icon_emoji });
      }
    }
  });

  bot.on('message', fn);
});