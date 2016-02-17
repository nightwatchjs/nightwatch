var assert = require('assert');

module.exports = {
  beforeEach : function(client, callback) {
    var testName = client.currentTest.name;
    assert.deepEqual(testName, 'demoTest');
    callback();
  },

  before : function(client, callback) {
    var testName = client.currentTest.name;
    assert.deepEqual(testName, '');
    callback();
  },

  demoTest : function (client) {
    var testName = client.currentTest.name;
    client.assert.ok('Test OK');
    client.assert.equal(1, 1);
    assert.equal(testName, 'demoTest');
    client.end();
  },

  afterEach : function(client, callback) {
    var testName = client.currentTest.name;
    var results = client.currentTest.results;

    assert.equal(results.passed, 2);
    assert.equal(results.failed, 0);
    assert.equal(results.tests, 2);
    assert.ok('demoTest' in results.testcases);
    assert.equal(results.testcases.demoTest.assertions.length, 2);
    assert.deepEqual(testName, 'demoTest');
    callback();
  },

  after : function(client, callback) {
    var testName = client.currentTest.name;
    assert.deepEqual(testName, null);
    callback();
  }
};