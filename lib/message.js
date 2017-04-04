const co = require('co');
const parseCards = require('../util/parse-cards');
const renderer = require('./render');

module.exports = co.wrap(function*(bot, collection, { id, icon }, data) {
  let { channel, ts: thread_ts, type, text, bot_id } = data;

  if (bot_id === id) {
    return;
  }

  if (type === 'message' && text) {
    let matches = parseCards(text);
    if (matches.length) {
      let cards = yield matches.map( (card) => {
        let name = new RegExp(`^${card}`, 'i');
        return collection.findOne({ name });
      });
      let results = cards.filter(Boolean);
      if (results.length) {
        let { response, attachments } = renderer(results);
        let options = { thread_ts, icon_emoji: icon, attachments };
        bot.postMessage(channel, response, options);
      }
    }
  }
});
