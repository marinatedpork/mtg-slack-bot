const { MongoClient } = require('mongodb');
const parse = require('../parse-cards');
const { mongoUrl, collectionName } = require('../../config/secrets');

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

test('It finds Failure', function(assert) {
  QUnit.stop();
  let [ parsed ] = parse('[[Failure//Comply]]');
  Query(this.collection, parsed).then((result) => {
    let actualName = result.name;
    assert.equal('Failure', actualName);
    QUnit.start();
  }, (error) => {
    console.log(error);
  });
});

test('It finds Fatal Push', function(assert) {
  QUnit.stop();
  Query(this.collection, 'Fatal Push').then((result) => {
    let actualName = result.name;
    assert.equal('Fatal Push', actualName);
    QUnit.start();
  }, (error) => {
    console.log(error);
  });
});
