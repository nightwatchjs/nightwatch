var assert = require('assert');

module.exports = {
  beforeEach : function(client) {
    client.globals.calls++;
  },

  before : function(client) {
    client.globals.calls++
  },

  demoTestSyncOne : function (client) {
    client.url('http://localhost');
    var testName = client.currentTest.name;
    assert.equal(testName, 'demoTestSyncOne');
  },

  demoTestSyncTwo : function (client) {
    var testName = client.currentTest.name;
    assert.equal(testName, 'demoTestSyncTwo');
    client.end();
  },

  afterEach : function() {
    var client = this.client;
    client.globals.calls++
  },

  after : function(client) {
    client.globals.calls++
  }
};