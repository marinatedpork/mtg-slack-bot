const logger = require('../util/logger');

module.exports = (db, data) => {
  logger(`[CLOSING]: ${data}`);
  db.close();
}
