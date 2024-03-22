var assert = require('assert');

module.exports = {
  demoTestMixed(client) {
    client.url('http://localhost').end();
  },

  afterEach(client, callback) {
    setTimeout(function () {
      assert.strictEqual(client.currentTest.results.passed, 0);
      assert.strictEqual(client.currentTest.results.failed, 0);
      assert.strictEqual(client.currentTest.results.errors, 0);
      assert.strictEqual(client.currentTest.results.skipped, 0);
      assert.strictEqual(client.currentTest.results.tests, 0);

      callback();
    }, 10);
  }
};