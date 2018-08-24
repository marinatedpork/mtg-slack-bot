const PATTERN = /\[\[([-\s,.'’A-Za-z0-9_]+)\]\]/g;

module.exports = (text) => {
  return [...new Set((text.match(PATTERN) || []).reduce((a, o) => {
    let r = o.replace(/[\[\]]/g, '');
    return r.trim() ? a.concat([r]) : a;
  }, []))];
}
