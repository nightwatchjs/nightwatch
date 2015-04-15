module.exports = {
  beforeEach : function(client, callback) {
    var testName = client.currentTest.name;
    client.globals.test.deepEqual(testName, 'demoTest');
    callback();
  },

  before : function(client, callback) {
    var testName = client.currentTest.name;
    client.globals.test.deepEqual(testName, '');
    callback();
  },

  demoTest : function (client) {
    var testName = client.currentTest.name;
    client.globals.test.deepEqual(testName, 'demoTest');
    client.end();
  },

  afterEach : function(callback) {
    var client = this.client;
    var testName = client.currentTest.name;
    client.globals.test.deepEqual(testName, 'demoTest');
    callback();
  },

  after : function(client, callback) {
    var testName = client.currentTest.name;
    client.globals.test.deepEqual(testName, null);
    callback();
  }
};