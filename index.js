var request = require('request');
var token = require('./config/secrets')
var url = 'https://slack.com/api/rtm.start?token='

var exampleSocket = new WebSocket("ws://www.example.com/socketserver", "protocolOne");

exampleSocket.onmessage = function (event) {
  console.log(event.data);
}