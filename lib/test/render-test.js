const sinon = require('sinon');
const proxyquire = require('proxyquire');

QUnit.module('Render', {
  setup() {
    this.mockRenderer = { Symbolizer: sinon.stub() };
    this.listStub = sinon.stub();
    this.detailsStub = sinon.stub();

    this.render = proxyquire('../render', {
      './render/list': this.listStub,
      './render/details': this.detailsStub,
      'mtg-card-renderer': this.mockRenderer
    });
  }
});

test('It calls the Symbolizer on the result', function(assert) {
  const { Symbolizer } = this.mockRenderer;

  this.render([]);

  assert.ok(Symbolizer.called);
});

test('It calls the detail function where there is just one card', function(assert) {
  this.render(['black lotus']);

  assert.ok(this.detailsStub.calledOnce);
  assert.ok(this.listStub.notCalled);
});

test('It calls the list function where there is just one card', function(assert) {
  this.render(['black lotus', 'mox opal']);

  assert.ok(this.detailsStub.notCalled);
  assert.ok(this.listStub.calledOnce);
});
