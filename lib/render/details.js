const gathererImage = require('./helpers/gatherer-image');
const gathererUrl = require('./helpers/gatherer-url');
const setIcon = require('./helpers/set-icon');
const hexcode = require('./helpers/hex-color-map');
const { Symbolizer } = require('mtg-card-renderer');
const bold = require('./helpers/slack/bold');
const url = require('./helpers/slack/url');
const label = require('./helpers/slack/label');
const labels = require('./helpers/labels');

module.exports = ([{ text, manaCost, name, printings, rarity, colorIdentity, multiverseid, power, toughness, type, loyalty }]) => {
  let [ set ] = printings.slice(-1);
  let colorStr = colorIdentity ? colorIdentity.sort().join('') : 'C';

  let renderedName = bold(url(gathererUrl(multiverseid), name));
  let renderedManaCost = manaCost ? `${label(labels.manaCost)}${manaCost}` : '';
  let renderedType = `${label(labels.type)}${type}`;
  let renderedText = text ? `\n${text}` : '';
  let renderedPt = power ? `${label(labels.pt)}${power}/${toughness}` : '';
  let renderedLoyalty = loyalty ? `${label(labels.loyalty)}${loyalty}` : '';

  let rendered = Symbolizer([
    renderedName,
    renderedManaCost,
    renderedType,
    renderedText,
    renderedPt,
    renderedLoyalty
  ].filter(Boolean).join('\n'));

  return {
    response: rendered,
    attachments: [{
      fallback: '',
      color: hexcode[colorStr].hexcode,
      author_name: name,
      author_link: gathererUrl(multiverseid),
      author_icon: setIcon(set, rarity),
      image_url: gathererImage(multiverseid)
    }]
  };
};