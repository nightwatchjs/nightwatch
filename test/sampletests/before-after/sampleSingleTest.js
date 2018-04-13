var assert = require('assert');

module.exports = {
  before : function(client, callback) {
    var testName = client.currentTest.name;
    assert.equal(testName, '');
    client.globals.calls++;
    callback();
  },

  beforeEach : function(client, callback) {
    var testName = client.currentTest.name;
    assert.equal(testName, 'demoTest');
    client.globals.calls++;
    callback();
  },

  demoTest : function (client) {
    var testName = client.currentTest.name;
    assert.equal(testName, 'demoTest');
    client.globals.calls++
    client.end();
  },

  afterEach : function(client, callback) {
    var testName = client.currentTest.name;
    assert.equal(testName, 'demoTest');
    client.globals.calls++
    callback();
  },

  after : function(client, callback) {
    var testName = client.currentTest.name;
    assert.equal(testName, 'demoTest');
    client.globals.calls++
    callback();
  }
};