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
    client.assert.ok('Test OK');
    client.assert.equal(1, 1);
    client.globals.test.deepEqual(testName, 'demoTest');
    client.end();
  },

  afterEach : function(client, callback) {
    var testName = client.currentTest.name;
    var test = client.globals.test;
    var results = client.currentTest.results;

    test.equal(results.passed, 2);
    test.equal(results.failed, 0);
    test.equal(results.tests, 2);
    test.ok('demoTest' in results.testcases);
    test.equal(results.testcases.demoTest.assertions.length, 2);
    test.deepEqual(testName, 'demoTest');
    callback();
  },

  after : function(client, callback) {
    var testName = client.currentTest.name;
    client.globals.test.deepEqual(testName, null);
    callback();
  }
};