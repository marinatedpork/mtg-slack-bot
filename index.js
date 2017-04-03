console.log('Executing index.js...');

/**
 * Library dependencies
 */

const co = require('co');
const SlackBot = require('slackbots');
const { MongoClient } = require('mongodb');

/**
 * Project modules
 */

const config = require('./config/secrets');
const parseCards = require('./util/parse-cards');
const message = require('./lib/message');
const close = require('./lib/close');
const start = require('./lib/start');

/**
 * Configurations
 */

const { token, mongoUrl, collectionName, bot: { id, icon, name } } = config;

/**
 * Run the slack bot
 */

co(function*() {
  console.log('Connecting to MongoClient...');
  const bot = new SlackBot({ token, name });
  const db = yield MongoClient.connect(mongoUrl);
  const collection = db.collection(collectionName);
  console.log('Firing up bot...');
  bot.on('start', start.bind(null, bot, { icon_emoji: icon }));
  bot.on('message', message.bind(null, bot, collection, { id, icon }));
  bot.on('close', close.bind(null, db));
}).catch( error => console.log(error) );
