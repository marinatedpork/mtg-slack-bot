const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const assert = require('assert');
const sleep = require('thread-sleep');

const url = 'mongodb://localhost:27017/mtg';
const DATA_PATH = process.env.PATH_TO_JSON;
const files = fs.readdirSync(DATA_PATH);
const numberOfFiles = files.length;

function isLastFile(i) {
  return (i + 1) === numberOfFiles;
}

function ingest(db, callback, file, index) {
  let filePath = path.join(DATA_PATH, file);
  let collection = db.collection('cards');
  let { cards } = JSON.parse(fs.readFileSync(filePath));
  console.log(`Attempting to insert ${cards.length} records from ${filePath}`);
  collection.insertMany(cards, (err, result) => {
    assert.equal(null, err);
    console.log(`Successfully inserted ${result.ops.length} from ${filePath}`);
    if (isLastFile(index)) {
      callback(db);
    }
  });
  sleep(100);
}

MongoClient.connect(url, (err, db) => {
  assert.equal(null, err);
  console.log('Connected correctly to server');
  console.log(`Attempting to ingest ${files.length}...`);
  let callback = ingest.bind(null, db, (db) => {
    console.log('Closing DB connection.');
    db.close();
  });
  files.forEach(callback);
});

