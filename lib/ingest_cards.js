const path = require('path');
const fs = require('fs');
const co = require('co');
const { MongoClient } = require('mongodb');

const build = (dataPath) => {
  return fs.readdirSync(dataPath).reduce( (accumulator, name) => {
    let filePath = path.join(dataPath, name);
    let { cards } = JSON.parse(fs.readFileSync(filePath));
    return accumulator.concat(cards);
  }, []);
}

(function(dataPath) {
  co(function*() {
    console.log(`Path to data: ${dataPath}`);
    let db = yield MongoClient.connect('mongodb://localhost:27017/mtg');
    console.log('Connecting to server');
    let collection = db.collection('cards');
    console.log('Building cards');
    let cards = build(dataPath);
    console.log(`About to write ${cards.length} cards.`);
    let { insertedCount } = yield collection.insertMany(cards);
    console.log(`Inserted ${insertedCount} records.`);
    db.close();
  }).catch(function(err) {
    console.log('Error!');
    console.log(err.stack);
  });
})(process.env.PATH_TO_JSON);
