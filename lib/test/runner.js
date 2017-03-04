var runner = require('qunit');

var tests = [
  {
    code: {
      path: '../message.js',
      namespace: 'Message'
    },
    tests: './message-test.js'
  },
  {
    code: {
      path: '../close.js',
      namespace: 'Close'
    },
    tests: './close-test.js'
  }
];

tests.forEach(test => runner.run(test));
