const { adminUserId, adminUserChannel } = require('../config/secrets');

module.exports = ({ user = '', channel = '' } = {}) => {
  return user === adminUserId && channel === adminUserChannel;
}
