const { mongoUrl, collectionName } = require('../../config/secrets');
const { MongoClient } = require('mongodb');

QUnit.module('Query', {
  setup() {
    QUnit.stop();
    MongoClient.connect(mongoUrl).then((db) => {
      this.db = db;
      this.collection = db.collection(collectionName);
      QUnit.start();
    });
  },
  teardown() {
    this.db.close();
  }
});

test('It finds Gitrog', function(assert) {
  QUnit.stop();
  Query(this.collection, 'Gitrog').then((result) => {
    let actualName = result.name;
    assert.equal('The Gitrog Monster', actualName);
    QUnit.start();
  }, (error) => {
    console.log(error);
  });
});

test('It finds Genesis', function(assert) {
  QUnit.stop();
  Query(this.collection, 'Genesis').then((result) => {
    let actualName = result.name;
    assert.equal('Genesis', actualName);
    QUnit.start();
  }, (error) => {
    console.log(error);
  });
});

test('It finds Jester\'s Cap with "Jester’s Cap"', function(assert) {
  QUnit.stop();
  Query(this.collection, 'Jester’s Cap').then((result) => {
    let actualName = result.name;
    assert.equal('Jester\'s Cap', actualName);
    QUnit.start();
  }, (error) => {
    console.log(error);
  });
});

test('It finds Jester\'s Cap with "Jesters Cap"', function(assert) {
  QUnit.stop();
  Query(this.collection, 'Jesters Cap').then((result) => {
    let actualName = result.name;
    assert.equal('Jester\'s Cap', actualName);
    QUnit.start();
  }, (error) => {
    console.log(error);
  });
});

test('It finds Dispel', function(assert) {
  QUnit.stop();
  Query(this.collection, 'dispel').then((result) => {
    let actualName = result.name;
    assert.equal('Dispel', actualName);
    QUnit.start();
  }, (error) => {
    console.log(error);
  });
});
