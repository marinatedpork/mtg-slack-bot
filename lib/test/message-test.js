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

// test('It posts the rendered message to a thread in the given channel', function(assert) {

// });

// test('It does nothing if there are no parsed cards', 1, function(assert) {

// });

// test('It does nothing if the data type is not a message', 1, function(assert) {

// });

// test('It does nothing if the message sender is the bot', 1, function(assert) {

// });

// test('It renders nothing for cards that are not in the database', 1, function(assert) {

// });
