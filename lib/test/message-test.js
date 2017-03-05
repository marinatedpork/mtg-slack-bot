const sinon = require('sinon');
const proxyquire = require('proxyquire');
QUnit.module('Message');

const fakeMessage = {
  channel: 'channel',
  ts: 'thread_id',
  type: 'message',
  text: 'hello_world',
  bot_id: '1337'
};

test('It parses the cards from the message', 1, function(assert) {
  const mockCollection = { findOne: sinon.stub() };
  const mockBot = { postMessage: sinon.stub() };
  const mockRenderer = { Renderer: sinon.stub().returns([]) };
  const parseStub = sinon.stub().returns(['Black Lotus']);
  const message = proxyquire('../message', {
    '../util/parse-cards': parseStub,
    'mtg-card-renderer': mockRenderer
  });

  message(mockBot, mockCollection, { id: 'id', icon: 'icon' }, fakeMessage);

  assert.ok(parseStub.calledWith(fakeMessage.text));
});

test('It finds each parsed card in the collection', 3, function(assert) {
  const mockCollection = { findOne: sinon.stub() };
  const mockBot = { postMessage: sinon.stub() };
  const mockRenderer = { Renderer: sinon.stub().returns([]) };
  const parseStub = sinon.stub().returns(['Black Lotus', 'Ruby Mox']);
  const message = proxyquire('../message', {
    '../util/parse-cards': parseStub,
    'mtg-card-renderer': mockRenderer
  });

  message(mockBot, mockCollection, { id: 'id', icon: 'icon' }, fakeMessage);

  assert.ok(mockCollection.findOne.calledTwice);

  let [[{ name: callOne }], [{ name: callTwo }]] = mockCollection.findOne.args;

  assert.equal(callOne.toString(), '/Black Lotus/i');
  assert.equal(callTwo.toString(), '/Ruby Mox/i');
});

test('It builds a message with the renderer out of the query results', 2, function(assert) {
  const expected = 'hello';
  const mockCollection = { findOne: sinon.stub().returns(expected) };
  const mockBot = { postMessage: sinon.stub() };
  const mockRenderer = { Renderer: sinon.stub().returns([]) };
  const parseStub = sinon.stub().returns(['Black Lotus']);
  const message = proxyquire('../message', {
    '../util/parse-cards': parseStub,
    'mtg-card-renderer': mockRenderer
  });

  message(mockBot, mockCollection, { id: 'id', icon: 'icon' }, fakeMessage);

  console.log(mockRenderer.Renderer.args);

  let [[ actualOne ], [ actualTwo ]] = mockRenderer.Renderer.args;

  console.log(actualOne, actualTwo);

  assert.equal(actualOne, expectedOne);
  assert.equal(actualTwo, expectedTwo);
});

// test('It posts the rendered message to a thread in the given channel', 1, function(assert) {

// });

// test('It does nothing if there are no parsed cards', 1, function(assert) {

// });

// test('It does nothing if the data type is not a message', 1, function(assert) {

// });

// test('It does nothing if the message sender is the bot', 1, function(assert) {

// });

// test('It renders nothing for cards that are not in the database', 1, function(assert) {

// });
