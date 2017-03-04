const sinon = require('sinon');
const proxyquire = require('proxyquire');
QUnit.module('Message');


test('It parses the cards from the message', 1, function(assert) {
  const fakeMessage = {
    channel: 'channel',
    ts: 'thread_id',
    type: 'message',
    text: 'hello_world',
    bot_id: '1337'
  };

  const mockCollection = { findOne: sinon.stub() };
  const mockBot = { postMessage: sinon.stub() };
  const mockRenderer = { Renderer: sinon.stub().returns(['Best card!']) };
  const parseStub = sinon.stub().returns(['Black Lotus']);
  const proxies = {
    '../util/parse-cards': parseStub,
    'mtg-card-renderer': mockRenderer
  };
  
  const message = proxyquire('../message', proxies);

  message(mockBot, mockCollection, { id: 'id', icon: 'icon' }, fakeMessage);
  assert.ok(parseStub.calledWith(fakeMessage.text));
});

// test('It finds each parsed card in the collection', 1, function(assert) {

// });

// test('It builds a message with the renderer', 1, function(assert) {

// });

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
