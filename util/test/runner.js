const runner = require('qunit');

const tests = [
  {
    code: {
      path: 'util/parse-cards.js',
      namespace: 'ParseCards'
    },
    tests: 'util/test/parse-cards-test.js'
  }
];

tests.forEach(test => runner.run(test));
