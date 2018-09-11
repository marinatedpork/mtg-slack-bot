/**
 * Usage:
 *
 * PATH_TO_JSON=/path/to/mtg/json node ingest-cards.js
 */

const path = require('path');
const fs = require('fs');
const co = require('co');
const { MongoClient } = require('mongodb');
const { mongoUrl, collectionName } = require('../config/secrets');

const build = (dataPath) => {
  return fs.readdirSync(dataPath).reduce( (accumulator, name) => {
    let filePath = path.join(dataPath, name);
    let { cards } = JSON.parse(fs.readFileSync(filePath));
    return accumulator.concat(cards);
  }, []);
}

(function(dataPath) {
  co(function*() {
    console.log(`Path to data: ${dataPath}.`);
    console.log(`Mongo Url: ${mongoUrl}.`);
    let db = yield MongoClient.connect(mongoUrl);
    console.log('Connecting to server.');
    let collection = db.collection(collectionName);
    console.log('Emptying collection.');
    collection.remove({});

    const sets = fs.readdirSync(dataPath);
    const setTotal = sets.length;
    console.log(`About to insert ${sets.length} sets.`);

    const write = co.wrap(function*([name, ...tail], recordCount = 0, setCount = 0) {
      let filePath = path.join(dataPath, name);
      let { cards } = JSON.parse(fs.readFileSync(filePath));
      let { insertedCount } = yield collection.insertMany(cards);
      console.log(`Completed set ${setCount + 1} of ${setTotal}. Inserted ${insertedCount} ${name} records.`);
      let newRecordCount = recordCount + insertedCount;
      if (tail.length) {
        setTimeout(() => {
          write(tail, newRecordCount, setCount + 1);
        }, 300);
      } else {
        setTimeout(co.wrap(function*() {
          const actualTotal = yield collection.count();
          console.log(`Completed after writing a total of ${newRecordCount} records. Data record count: ${actualTotal}. Difference between payloads and collection: ${(newRecordCount) - actualTotal}`);
          db.close();
          process.exit(0);
        }), 2000);
      }
    });

    write(sets).catch(function(err) {
      console.log('Error!');
      console.log(err.stack);
      process.exit(1);
    });

  }).catch(function(err) {
    console.log('Error!');
    console.log(err.stack);
    process.exit(1);
  });
})(process.env.PATH_TO_JSON);
