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
    console.log(`Path to data: ${dataPath}`);
    console.log(`Mongo Url: ${mongoUrl}`);
    let db = yield MongoClient.connect(mongoUrl);
    console.log('Connecting to server');
    let collection = db.collection(collectionName);
    console.log('Building cards');
    let cards = build(dataPath);
    console.log(`About to write ${cards.length} cards.`);
    let { insertedCount } = yield collection.insertMany(cards);
    console.log(`Inserted ${insertedCount} records.`);
    db.close();
    process.exit(0);
  }).catch(function(err) {
    console.log('Error!');
    console.log(err.stack);
    process.exit(1);
  });
})(process.env.PATH_TO_JSON);
