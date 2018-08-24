const co = require('co');
const parseCards = require('../util/parse-cards');
const chunk = require('../util/chunk');
const logger = require('../util/logger');
const query = require('../util/query');
const renderer = require('./render');

const CHUNK_SIZE = 12;

module.exports = co.wrap(function*(bot, collection, { id, icon }, data) {
  let { channel, ts: thread_ts, type, text, bot_id, url } = data;

  if (bot_id === id) {
    return;
  }

  logger('****', `[EVENT]: ${type}`, `[CHANNEL]: ${channel}`, `[THREAD]: ${thread_ts}`);

  switch (type) {
    case 'reconnect_url':
      if (!url) {
        break;
      }

      bot.wsUrl = url;

      logger(`[RECONNECT URL]: ${url}`);
      break;

    case 'message':
      if (!text) {
        break;
      }

      let matches = parseCards(text);

      if (!matches.length) {
        break;
      }

      logger(`[QUERYING]: (${matches.length}) - ${matches}`);

      chunk(matches, CHUNK_SIZE).forEach(co.wrap(function*(batch, i) {
        let cards = yield batch.map((card) => {
          return query(collection, card);
        });
        let results = cards.filter(Boolean);

        logger(`[RESULTS]: (${matches.length}), CHUNK: ${i}`);

        if (!results.length) {
          return;
        }

        let { response, attachments } = renderer(results);
        let options = { thread_ts, icon_emoji: icon, attachments };
        bot.postMessage(channel, response, options);
        logger(`[SENDING]: ${channel}, ${thread_ts}, CHUNK: ${i}`);
      }));
      break;

    default:
      logger(`[HANDLER] Unhandled event type: '${type}'.`);
      break;
  }

  logger('****');
});
