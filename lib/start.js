const logger = require('../util/logger');

module.exports = (bot, adminUser, params) => {
  logger('[CONNECTING]: Success!');
  bot.postMessageToUser(username, 'Bot is fired up...', params);
};
