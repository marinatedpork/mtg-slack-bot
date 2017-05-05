const logger = require('../util/logger');

module.exports = (bot, adminUser, params) => {
  logger('[CONNECTING]: Success!');
  bot.postMessageToUser(adminUser, 'Bot is fired up...', params);
};
