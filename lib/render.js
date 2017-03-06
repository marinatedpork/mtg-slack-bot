const { Symbolizer } = require('mtg-card-renderer');

function render(cards) {
  return Symbolizer(cards.length > 1 ? render.list(cards) : render.details(cards));
}

render.list = require('./render/list');
render.details = require('./render/details');

module.exports = render;