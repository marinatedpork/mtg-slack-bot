module.exports = (text) => {
  var PATTERN = /\[\[([\s,.'A-Za-z0-9_]+)\]\]/g;
  return (text.match(PATTERN) || []).map((o) => {
    return o.replace('[[', '').replace(']]', '');
  });
};
