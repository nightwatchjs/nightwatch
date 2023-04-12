var assert = require('assert');

module.exports = {
  before: function(client, cb) {
    client.assert.ok(false);
    client.globals.calls++;
    cb();
  },

  beforeEach: function(client, cb) {
    client.globals.calls++;
    cb();
  },

  demoTestSyncOne: function (client) {
    client.url('http://localhost');
    var testName = client.currentTest.name;
    assert.strictEqual(testName, 'demoTestSyncOne');
  },

  demoTestSyncTwo: function (client) {
    var testName = client.currentTest.name;
    assert.strictEqual(testName, 'demoTestSyncTwo');
    client.end();
  },

  afterEach: function(client, cb) {
    client.globals.calls++;
    client.end(cb);
  },

  after: function(client) {
    client.globals.calls++;
  }
};