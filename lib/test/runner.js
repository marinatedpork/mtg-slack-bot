var runner = require('qunit');

var tests = [
  {
    code: {
      path: 'lib/message.js',
      namespace: 'Message'
    },
    tests: 'lib/test/message-test.js'
  },
  {
    code: {
      path: 'lib/close.js',
      namespace: 'Close'
    },
    tests: 'lib/test/close-test.js'
  },
  {
    code: {
      path: 'lib/render.js',
      namespace: 'Render'
    },
    tests: 'lib/test/render-test.js'
  }
];

tests.forEach(test => runner.run(test));
