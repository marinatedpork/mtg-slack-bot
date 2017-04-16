const logger = require('../util/logger');

module.exports = (bot, db, data) => {
  logger(`[RECONNECTING]: ${data}`);
  bot.connect();
}
