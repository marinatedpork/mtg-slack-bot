const co = require('co');
const parseCards = require('../util/parse-cards');
const logger = require('../util/logger');
const renderer = require('./render');

module.exports = co.wrap(function*(bot, collection, { bot_id, icon }, data) {
  let { channel, ts: thread_ts, type, text, user_id } = data;

  if (user_id === bot_id) {
    return;
  }

  logger('****', `[EVENT]: ${type}`, `[CHANNEL]: ${channel}`, `[THREAD]: ${thread_ts}`);

  if (type === 'message' && text) {
    let matches = parseCards(text);
    if (matches.length) {

      logger(`[QUERYING]: ${matches.length} ${matches}`);

      let cards = yield matches.map( (card) => {
        let name = new RegExp(`^${card}`, 'i');
        return collection.findOne({ name });
      });
      let results = cards.filter(Boolean);

      logger(`[RESULTS]: ${matches.length}`);

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
