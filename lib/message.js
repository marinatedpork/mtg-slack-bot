const co = require('co');
const parseCards = require('../util/parse-cards');
const logger = require('../util/logger');
const renderer = require('./render');

module.exports = co.wrap(function*(bot, collection, { id, icon }, data) {
  let { channel, ts: thread_ts, type, text, bot_id, url } = data;

  if (bot_id === id) {
    return;
  }

  logger('****', `[EVENT]: ${type}`, `[CHANNEL]: ${channel}`, `[THREAD]: ${thread_ts}`);

  if (type === 'reconnect_url' && url) {

    logger(`[RECONNECT URL]: ${url}`);

    bot.wsUrl = url;
    return;
  }

  if (type === 'message' && text) {
    let matches = parseCards(text);
    if (matches.length) {

      logger(`[QUERYING]: (${matches.length}) - ${matches}`);

      let cards = yield matches.map( (card) => {
        let name = new RegExp(`^${card}`, 'i');
        return collection.findOne({ name });
      });
      let results = cards.filter(Boolean);

      logger(`[RESULTS]: (${matches.length})`);

      if (results.length) {
        let { response, attachments } = renderer(results);
        let options = { thread_ts, icon_emoji: icon, attachments };

        logger(`[SENDING]: ${channel}, ${thread_ts}`);

        bot.postMessage(channel, response, options);
      }
    }
  }

  logger('****');
});
