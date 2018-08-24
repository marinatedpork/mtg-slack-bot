const runner = require('qunit');
const INTEGRATION_TEST = process.env.INTEGRATION_TEST

const tests = [
  // {
  //   code: {
  //     path: 'util/parse-cards.js',
  //     namespace: 'ParseCards'
  //   },
  //   tests: 'util/test/parse-cards-test.js'
  // }
];

if (INTEGRATION_TEST) {
  tests.push({
    code: {
      path: 'util/query.js',
      namespace: 'Query'
    },
    tests: 'util/test/query-integration-test.js'
  });
}

tests.forEach(test => runner.run(test));
