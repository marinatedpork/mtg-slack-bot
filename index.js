var token = require('./config/secrets');
var SlackBot = require('slackbots');
var MTGClient = require('mtgsdk').card;
var MTGCardRenderer = require('mtg-card-renderer');
var Renderer = MTGCardRenderer.Renderer;
var Serializer = MTGCardRenderer.Serializer;

function parseCards(text) {
  var PATTERN = /\[\[([\s,.'A-Za-z0-9_]+)\]\]/g;
  return text.match(PATTERN).map(function(o) {
    return o.replace('[[', '').replace(']]', '');
  });
}

var bot = new SlackBot({
  token: token,
  name: 'Jace'
});

bot.on('start', function() {
  // bot.postTo('testing', 'Jace is online');
});

bot.on('message', function(data) {
  console.log('=============================================');
  console.log(data);
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
            bot.postTo('testing', response);
          });
        });
      });
    }
  }
  console.log('=============================================');
});