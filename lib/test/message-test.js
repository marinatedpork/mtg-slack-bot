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
    this.query = sinon.stub();
    this.mockBot = { postMessage: sinon.stub() };
    this.mockRenderer = sinon.stub();
    this.parseStub = sinon.stub();

    this.message = proxyquire('../message', {
      '../util/parse-cards': this.parseStub,
      '../util/logger': function() {},
      '../util/query': this.query,
      './render': this.mockRenderer
    });
  }
});

test('It parses the cards from the message', function(assert) {
  const { parseStub, mockRenderer } = this;

  mockRenderer.returns([]);
  parseStub.returns(['Black Lotus']);

  this.message(this.mockBot, this.mockCollection, this.mockConfig, this.fakeMessage);

  assert.ok(this.parseStub.calledWith(this.fakeMessage.text));
});

test('It finds each parsed card in the collection', function(assert) {
  const { parseStub, mockRenderer } = this;

  mockRenderer.returns([]);
  parseStub.returns(['Black Lotus', 'Ruby Mox']);

  this.message(this.mockBot, this.mockCollection, this.mockConfig, this.fakeMessage);

  assert.ok(this.query.calledTwice);

  let [[_, callOne], [__, callTwo]] = this.query.args;

  assert.equal(callOne, 'Black Lotus');
  assert.equal(callTwo, 'Ruby Mox');
});

test('It builds a message with the renderer out of the query results', function(assert) {
  const { parseStub, mockRenderer, mockCollection, mockBot, query } = this;
  const expected = 'hello';
  const expectedRender = { response: 'response', attachments: ['attachments']};

  query.returns(Promise.resolve(expected));
  mockRenderer.returns(expectedRender);
  parseStub.returns([expected]);

  stop();

  this.message(mockBot, mockCollection, this.mockConfig, this.fakeMessage);

  setTimeout(() => {
    let [[_, actualQuery]] = query.args;
    let [[ __, actualMessage ]] = mockBot.postMessage.args;

    assert.equal(actualQuery, expected);
    assert.equal(actualMessage, 'response');

    start();
  });
});

test('It posts the rendered message to a thread in the given channel', function(assert) {
  const { parseStub, mockRenderer, mockBot, mockCollection, fakeMessage: { channel, ts }, query } = this;
  const expectedMessage = 'Black Lotus';
  const expectedRender = { response: expectedMessage, attachments: ['attachments']};

  query.returns(expectedMessage);
  parseStub.returns([expectedMessage]);
  mockRenderer.returns(expectedRender);

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
  assert.ok(this.mockRenderer.notCalled);
});

test('It does nothing if the data type is not a message', function(assert) {
  this.fakeMessage.type = 'some other type';

  this.message(this.mockBot, this.mockCollection, this.mockConfig, this.fakeMessage);

  assert.ok(this.parseStub.notCalled);
  assert.ok(this.mockCollection.findOne.notCalled);
  assert.ok(this.mockBot.postMessage.notCalled);
  assert.ok(this.mockRenderer.notCalled);
});

test('It does nothing if the message sender is the bot', function(assert) {
  this.fakeMessage.bot_id = this.mockConfig.id;

  this.message(this.mockBot, this.mockCollection, this.mockConfig, this.fakeMessage);

  assert.ok(this.parseStub.notCalled);
  assert.ok(this.mockCollection.findOne.notCalled);
  assert.ok(this.mockBot.postMessage.notCalled);
  assert.ok(this.mockRenderer.notCalled);
});

test('It renders nothing for cards that are not in the database', function(assert) {
  const { parseStub, mockRenderer, mockCollection, query } = this;

  parseStub.returns(['black lotus', 'not actually a real card']);
  mockRenderer.returns({response: 'response', attachments: 'attachments'});

  query.onFirstCall().returns(Promise.resolve('a card'));
  query.onSecondCall().returns(Promise.resolve(null));

  stop();

  this.message(this.mockBot, mockCollection, this.mockConfig, this.fakeMessage);

  setTimeout(() => {
    assert.ok(mockRenderer.calledOnce);

    start();
  });
});

test('It sets the reconnect_url when provided', function(assert) {
  const url = 'ws://hello';
  this.fakeMessage.type = 'reconnect_url';
  this.fakeMessage.url = 'ws://hello';

  this.message(this.mockBot, this.mockCollection, this.mockConfig, this.fakeMessage);

  assert.equal(this.mockBot.wsUrl, url);
});
