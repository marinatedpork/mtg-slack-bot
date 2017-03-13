const gathererImage = require('./helpers/gatherer-image');
const gathererUrl = require('./helpers/gatherer-url');
const setIcon = require('./helpers/set-icon');
const hexcode = require('./helpers/hex-color-map');
const { Symbolizer } = require('mtg-card-renderer');

module.exports = (cards) => {
  let attachments = cards.map( ({ text, name, printings, rarity, colorIdentity, multiverseid }) => {
    let [ set ] = printings.slice(-1);
    let colorStr = colorIdentity ? colorIdentity.sort().join('') : 'C';

    return {
      fallback: Symbolizer(text),
      color: hexcode[colorStr].hexcode,
      author_name: name,
      author_link: gathererUrl(multiverseid),
      author_icon: setIcon(set, rarity),
      image_url: gathererImage(multiverseid)
    };
  });

  return { text: '', attachments };
};