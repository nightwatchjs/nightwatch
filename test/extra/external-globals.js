const assert = require('assert');

module.exports = {
  'default': {},

  async before() {
    this.isFungus = true;
  },

  beforeEach(client, done) {
    done()
  },

  afterEach(client, done) {
    assert.strictEqual(client.globals.isFungus, true);

    done();
  },

  reporter(results) {
    assert.ok('modules' in results);
    if (results.lastError instanceof Error) {
      throw results.lastError;
    }

    assert.strictEqual(this.reporterCount, 0);
    assert.strictEqual(this.isFungus, true);

    this.reporterCount++;
  }
};
