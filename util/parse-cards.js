const BRACKET_PATTERN = /\[\[([-\s,.'’A-Za-z0-9_//]+)\]\]/g;
const SPLIT_CARD_REPLACE_PATTERN = /\s*\/\/.*$/;

module.exports = (text) => {
  return [...new Set((text.match(BRACKET_PATTERN) || []).reduce((a, o) => {
    let r = o.replace(/[\[\]]/g, '').replace(SPLIT_CARD_REPLACE_PATTERN, '');
    return r.trim() ? a.concat([r]) : a;
  }, []))];
}
