var assert = require('assert');

module.exports = {
  before: function() {
    browser.assert.ok(false);
    browser.globals.calls++;
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

  afterEach: function(client) {
    client.globals.calls++;
  },

  after: function(client) {
    client.globals.calls++;
  }
};