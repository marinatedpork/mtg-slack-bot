const sinon = require('sinon');
const proxyquire = require('proxyquire');
QUnit.module('Message', {
  setup() {
    this.mockConfig = {
      id: 'id',
      icon: 'icon'
    };

    this.fakeMessage = {
      channel: 'channel',
      ts: 'thread_id',
      type: 'message',
      text: 'hello_world',
      bot_id: '1337'
    };

    this.mockCollection = { findOne: sinon.stub() };
    this.mockBot = { postMessage: sinon.stub() };
    this.mockRenderer = { Renderer: sinon.stub() };
    this.parseStub = sinon.stub();

    this.message = proxyquire('../message', {
      '../util/parse-cards': this.parseStub,
      'mtg-card-renderer': this.mockRenderer
    });
  }
});

test('It parses the cards from the message', function(assert) {
  const { parseStub, mockRenderer } = this;

  mockRenderer.Renderer.returns([]);
  parseStub.returns(['Black Lotus']);

  this.message(this.mockBot, this.mockCollection, this.mockConfig, this.fakeMessage);

  assert.ok(this.parseStub.calledWith(this.fakeMessage.text));
});

test('It finds each parsed card in the collection', function(assert) {
  const { parseStub, mockRenderer } = this;

  mockRenderer.Renderer.returns([]);
  parseStub.returns(['Black Lotus', 'Ruby Mox']);

  this.message(this.mockBot, this.mockCollection, this.mockConfig, this.fakeMessage);

  assert.ok(this.mockCollection.findOne.calledTwice);

  let [[{ name: callOne }], [{ name: callTwo }]] = this.mockCollection.findOne.args;

  assert.equal(callOne.toString(), '/Black Lotus/i');
  assert.equal(callTwo.toString(), '/Ruby Mox/i');
});

test('It builds a message with the renderer out of the query results', function(assert) {
  const { parseStub, mockRenderer, mockCollection, mockBot } = this;
  const expected = 'hello';
  
  mockCollection.findOne.returns(Promise.resolve(expected));
  mockRenderer.Renderer.returns([expected]);
  parseStub.returns([expected]);

  stop();

  this.message(mockBot, mockCollection, this.mockConfig, this.fakeMessage);

  setTimeout(() => {
    let [[{ name: { source: actualQuery } }]] = mockCollection.findOne.args;
    let [[ _, actualMessage ]] = mockBot.postMessage.args;

    assert.equal(actualQuery, expected);
    assert.equal(actualMessage, expected);

    start();
  });
});

test('It posts the rendered message to a thread in the given channel', function(assert) {
  const { parseStub, mockRenderer, mockBot, mockCollection, fakeMessage: { channel, ts }} = this;
  const expectedMessage = 'Black Lotus';

  mockCollection.findOne.returns(expectedMessage);
  parseStub.returns([expectedMessage]);
  mockRenderer.Renderer.returns(expectedMessage);

  stop();

  this.message(mockBot, mockCollection, this.mockConfig, this.fakeMessage);

  setTimeout(() => {
    let [[ actualChannel, actualMessage, { thread_ts } ]] = mockBot.postMessage.args;

    assert.equal(actualChannel, channel);
    assert.equal(actualMessage, expectedMessage);
    assert.equal(thread_ts, ts);

    start();
  });

});

test('It does nothing if there are no parsed cards', function(assert) {
  this.parseStub.returns([]);

  this.message(this.mockBot, this.mockCollection, this.mockConfig, this.fakeMessage);

  assert.ok(this.parseStub.called);
  assert.ok(this.mockCollection.findOne.notCalled);
  assert.ok(this.mockBot.postMessage.notCalled);
  assert.ok(this.mockRenderer.Renderer.notCalled);
});

test('It does nothing if the data type is not a message', function(assert) {
  this.fakeMessage.type = 'some other type';

  this.message(this.mockBot, this.mockCollection, this.mockConfig, this.fakeMessage);

  assert.ok(this.parseStub.notCalled);
  assert.ok(this.mockCollection.findOne.notCalled);
  assert.ok(this.mockBot.postMessage.notCalled);
  assert.ok(this.mockRenderer.Renderer.notCalled);
});

test('It does nothing if the message sender is the bot', function(assert) {
  this.fakeMessage.bot_id = this.mockConfig.id;

  this.message(this.mockBot, this.mockCollection, this.mockConfig, this.fakeMessage);

  assert.ok(this.parseStub.notCalled);
  assert.ok(this.mockCollection.findOne.notCalled);
  assert.ok(this.mockBot.postMessage.notCalled);
  assert.ok(this.mockRenderer.Renderer.notCalled);
});

test('It renders nothing for cards that are not in the database', function(assert) {
  const { parseStub, mockRenderer, mockCollection } = this;

  parseStub.returns(['black lotus', 'not actually a real card']);

  mockCollection.findOne.onFirstCall().returns(Promise.resolve('a card'));
  mockCollection.findOne.onSecondCall().returns(Promise.resolve(null));

  stop();

  this.message(this.mockBot, mockCollection, this.mockConfig, this.fakeMessage);

  setTimeout(() => {
    assert.ok(mockRenderer.Renderer.calledOnce);

    start();
  });  
});
