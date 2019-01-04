const co = require('co');
const logger = require('../util/logger');
const { mainChannel, messages } = require('../config/secrets');

const { anniversary2019 } = messages;

module.exports = co.wrap(function*(bot, collection, { id, icon }, data) {
  const { text } = data;

  if (!text) {
    return;
  }

  switch(text) {
    case '$cmd party-2019-invite':
      bot.postMessage(mainChannel, anniversary2019.text, {
        icon_emoji: icon,
        attachments: anniversary2019.attachments
      }
    );
      break;
  }
});
