const logger = require('../util/logger');

module.exports = (bot, params) => {
  logger('[CONNECTING]: Success!');
  bot.postMessageToUser('marinatedpork', 'Bot is fired up...', params);
}
