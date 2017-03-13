const RARITY_MAP = {
  'rare': 'R',
  'mythic rare': 'M',
  'uncommon': 'U',
  'common': 'C'
};

module.exports = (set, rarity) => {
  let rarityCode = RARITY_MAP[rarity.toLowerCase()];
  return `http://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&set=${set}&size=small&rarity=rarityCode`;
};