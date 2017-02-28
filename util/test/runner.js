const runner = require('qunit');

const tests = [
  {
    code: {
      path: '../parse-cards.js',
      namespace: 'ParseCards'
    },
    tests: './parse-cards-test.js'
  }
];

tests.forEach(test => runner.run(test) );
