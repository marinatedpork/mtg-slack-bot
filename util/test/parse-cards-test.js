QUnit.module('ParseCards');

test('It returns all strings wrapped in double brackets', 1, function(assert) {
  const normal = '[[Angel\'s Grace]] [[Laboratory Maniac]] [[Gitaxian Probe]] [[Chromatic Star]]';
  const expected = ['Angel\'s Grace', 'Laboratory Maniac', 'Gitaxian Probe', 'Chromatic Star'];
  const actual = ParseCards(normal);
  assert.deepEqual(expected, actual);
});

test('It returns a unique array of strings', 1, function(assert) {
  const repeated = '[[Angel\'s Grace]] [[Angel\'s Grace]] [[Laboratory Maniac]]';
  const expected = ['Angel\'s Grace', 'Laboratory Maniac'];
  const actual = ParseCards(repeated);
  assert.deepEqual(expected, actual);
});

test('It returns an empty array if there are no strings wrapped in double brackets', 1, function(assert) {
  const noMatches = 'This is just a regular sentence';
  const expected = [];
  const actual = ParseCards(noMatches);
  assert.deepEqual(expected, actual);
});

test('It handles really awkward strings', 1, function(assert) {
  const bad = '[[]] [[ [[   ]] [[Laboratory Maniac]] [[!@ZC[[]]]]';
  const expected = ['Laboratory Maniac'];
  const actual = ParseCards(bad);
  assert.deepEqual(expected, actual);
});

test('It handles dashes', 1, function(assert) {
  const dashes = '[[Molimo, Maro-Sorcerer]]';
  const expected = ['Molimo, Maro-Sorcerer'];
  const actual = ParseCards(dashes);
  assert.deepEqual(expected, actual);
});

test('It smart apostrophe\'s', 1, function(assert) {
  const smartApostrophe = '[[Jester’s Cap]]';
  const expected = ['Jester’s Cap'];
  const actual = ParseCards(smartApostrophe);
  assert.deepEqual(expected, actual);
});
