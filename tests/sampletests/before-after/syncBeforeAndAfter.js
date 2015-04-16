module.exports = {
  beforeEach : function(client) {
    client.globals.test.ok('beforeEach callback called.');
  },

  before : function(client) {
    client.globals.test.ok('before callback called.');
  },

  demoTestSyncOne : function (client) {
    client.url('http://localhost');
    var testName = client.currentTest.name;
    client.globals.test.deepEqual(testName, 'demoTestSyncOne');
  },

  demoTestSyncTwo : function (client) {
    var testName = client.currentTest.name;
    client.globals.test.deepEqual(testName, 'demoTestSyncTwo');
    client.end();
  },

  afterEach : function() {
    var client = this.client;
    client.globals.test.ok('afterEach callback called.');
  },

  after : function(client) {
    client.globals.test.ok('after callback called.');
  }
};