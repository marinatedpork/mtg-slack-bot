const sinon = require('sinon');
QUnit.module('Close');

test('It closes the given database', 1, function(assert) {
  const close = sinon.stub();
  Close({ close });
  assert.ok(close.calledOnce);
});
