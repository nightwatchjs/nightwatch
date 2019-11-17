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
    client.assert.not.equal(1, 0);
    assert.strictEqual(testName, 'demoTest');
    client.end();
  },

  afterEach : function(client, callback) {
    var testName = client.currentTest.name;
    var results = client.currentTest.results;

    assert.strictEqual(results.passed, 3);
    assert.strictEqual(results.failed, 0);
    assert.strictEqual(results.tests, 3);
    assert.ok('demoTest' in results.testcases);
    assert.strictEqual(results.testcases.demoTest.assertions.length, 3);
    assert.deepEqual(testName, 'demoTest');
    callback();
  },

  after : function(client, callback) {
    var testName = client.currentTest.name;
    assert.deepEqual(testName, 'demoTest');
    callback();
  }
};
