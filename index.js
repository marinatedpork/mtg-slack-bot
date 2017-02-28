const co = require('co');
const config = require('./config/secrets');
const parseCards = require('./util/parse-cards');
const message = require('./lib/message');
const close = require('./lib/close');
const SlackBot = require('slackbots');
const { MongoClient } = require('mongodb');

const { token, mongoUrl, collectionName, bot: { id, icon, name } } = config;

co(function*() {
  const bot = new SlackBot({ token, name });
  const db = yield MongoClient.connect(mongoUrl);
  const collection = db.collection(collectionName);
  bot.on('message', message.bind(null, bot, collection, { id, icon }));
  bot.on('close', close.bind(null, db));
});
