var assert = require('assert');

module.exports = {
  before : function(client, cb) {
    client.globals.calls++;
    cb()
  },

  beforeEach : function(client, cb) {
    client.globals.calls++;
    cb()
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

  afterEach : function(client) {
    client.globals.calls++;
  },

  after : function(client) {
    client.globals.calls++;
  }
};