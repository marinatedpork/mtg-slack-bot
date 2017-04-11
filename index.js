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
const logger = require('./util/logger');
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
  logger('[CONNECTING]: MongoClient');
  const bot = new SlackBot({ token, name });
  const db = yield MongoClient.connect(mongoUrl);
  const collection = db.collection(collectionName);
  logger('[CONNECTING]: SlackBot');
  bot.on('start', start.bind(null, bot, { icon_emoji: icon }));
  bot.on('message', message.bind(null, bot, collection, { id, icon }));
  bot.on('close', close.bind(null, db));
}).catch( error => logger(`[ERROR]: ${error}`) );
