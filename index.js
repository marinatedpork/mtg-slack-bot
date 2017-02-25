var token = require('./config/secrets');
var parseCards = require('./util/parse-cards');
var SlackBot = require('slackbots');
var MTGClient = require('mtgsdk').card;
var MTGCardRenderer = require('mtg-card-renderer');
var Renderer = MTGCardRenderer.Renderer;
var Serializer = MTGCardRenderer.Serializer;

var bot = new SlackBot({
  token: token,
  name: 'Jace'
});

bot.on('start', function() {
});

bot.on('message', function(data) {
  console.log('=============================================');
  console.log(data);
  var channel = data.channel;
  var thread_ts = data.ts;
  if (data.type === 'message' && data.text) {
    console.log('IS MESSAGE');
    var matches = parseCards(data.text);
    console.log('MATCHES', matches);
    if (matches.length && typeof matches === 'object') {
      var queries = matches.forEach(function(o) {
        console.log(1, o);
        MTGClient.where({ name: '"' + o + '"'}).then(function(cards) {
        console.log(2, o);
          var success = Serializer.deserialize(cards, function(result) {
            console.log('Deserialized:', result);
            var response = Renderer(result);
            console.log('Rendered:', response);
            bot.postMessage(channel, response, { thread_ts: thread_ts, icon_emoji: ':jace:'});
          });
        });
      });
    }
  }
  console.log('=============================================');
});