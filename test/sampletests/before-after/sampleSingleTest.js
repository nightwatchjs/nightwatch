var assert = require('assert');

module.exports = {
  beforeEach : function(client, callback) {
    var testName = client.currentTest.name;
    assert.equal(testName, 'demoTest');
    client.globals.calls++
    callback();
  },

  before : function(client, callback) {
    var testName = client.currentTest.name;
    assert.equal(testName, '');
    client.globals.calls++
    callback();
  },

  demoTest : function (client) {
    var testName = client.currentTest.name;
    assert.equal(testName, 'demoTest');
    client.globals.calls++
    client.end();
  },

  afterEach : function(callback) {
    var client = this.client;
    var testName = client.currentTest.name;
    assert.equal(testName, 'demoTest');
    client.globals.calls++
    callback();
  },

  after : function(client, callback) {
    var testName = client.currentTest.name;
    assert.strictEqual(testName, null);
    client.globals.calls++
    callback();
  }
};