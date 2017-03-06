function render(cards) {
  return cards.length > 1 ? render.list(cards) : render.details(cards);
}

render.list = (cards) => {
  return cards.map( c => 'list' ).join('\n');
}

render.details = ([ card ]) => {
  return 'details'
}

module.exports = render;