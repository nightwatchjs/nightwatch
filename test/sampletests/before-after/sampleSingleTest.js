const assert = require('assert');

describe('samepleSingleTest', function() {
  before(function(client, callback) {
    let testName = client.currentTest.name;
    assert.strictEqual(testName, '');
    client.globals.calls++;
    client.globals.singleTestCalled = true;
    callback();
  });

  beforeEach(function(client, callback) {
    var testName = client.currentTest.name;
    assert.strictEqual(testName, 'demoTest');
    client.globals.calls++;
    callback();
  });

  test('demoTest', function(client) {
    var testName = client.currentTest.name;
    assert.strictEqual(testName, 'demoTest');
    client.globals.calls++;
    client.end();
  });

  afterEach(function(client, callback) {
    var testName = client.currentTest.name;
    assert.strictEqual(testName, 'demoTest');
    client.globals.calls++;
    callback();
  });

  after(function(client, callback) {
    var testName = client.currentTest.name;

    assert.strictEqual(testName, 'demoTest');
    client.globals.calls++;
    callback();
  });
});
