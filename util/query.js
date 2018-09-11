const co = require('co');
const stringSimilarity = require('string-similarity');

module.exports = co.wrap(function*(collection, search) {
  let pattern = search.replace(/\W+/, '.*').replace(/s/g, 's?');
  let name = new RegExp(`${pattern}`, 'i');
  let results = yield collection.find({ name }).toArray();
  let map = results.reduce((a, o) => Object.assign(a, { [o.name]: o }), {});
  let bestMatch = stringSimilarity.findBestMatch(search, Object.keys(map)).bestMatch.target;
  return map[bestMatch];
});
