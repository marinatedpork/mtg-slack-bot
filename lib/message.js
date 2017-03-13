const co = require('co');
const parseCards = require('../util/parse-cards');
const { Renderer: renderer } = require('mtg-card-renderer');

module.exports = co.wrap(function*(bot, collection, { id, icon }, data) {
  let { channel, ts: thread_ts, type, text, bot_id } = data;

  if (bot_id === id) {
    return;
  }

  if (type === 'message' && text) {
    let matches = parseCards(text);
    if (matches.length) {
      let cards = yield matches.map( (card) => {
        let name = new RegExp(card, 'i');
        return collection.findOne({ name });
      });
      let response = cards.filter(c => c).map(renderer).join('\n');
      bot.postMessage(channel, response, { thread_ts, icon_emoji: icon, attachments });
    }
  }
});