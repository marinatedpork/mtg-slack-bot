const sinon = require('sinon');
QUnit.module('Close');

test('It logs in the bot', 1, function(assert) {
  const login = sinon.stub();
  Close({ login });
  assert.ok(login.calledOnce);
});
