const sinon = require('sinon');
QUnit.module('Close');

test('It connects the bot', 1, function(assert) {
  const connect = sinon.stub();
  Close({ connect });
  assert.ok(connect.calledOnce);
});
