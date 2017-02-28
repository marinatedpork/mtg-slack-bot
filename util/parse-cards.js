const PATTERN = /\[\[([\s,.'A-Za-z0-9_]+)\]\]/g;

module.exports = (text) => {
  return [...new Set((text.match(PATTERN) || []).map((o) => {
    return o.replace(/[\[+\]+]/g, '');
  }))];
}
