function render(cards) {
  return cards.length > 1 ? render.list(cards) : render.details(cards);
}

render.list = require('./render/list');
render.details = require('./render/details');

module.exports = render;