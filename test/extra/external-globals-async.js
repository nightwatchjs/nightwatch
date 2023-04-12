const assert = require('assert');

module.exports = {
  'default': {},

  async before() {
    this.isFungus = true;
  },

  async beforeEach(client) {
    expect(this.isFungus).to.be.true;

    return new Promise(resolve => {
      setTimeout(resolve, 500);
    });
  },

  async afterEach(client) {
    assert.strictEqual(client.globals.isFungus, true);
  },

  async reporter(results) {
    assert.ok('modules' in results);

    if (results.lastError instanceof Error) {
      throw results.lastError;
    }

    assert.strictEqual(this.reporterCount, 0);
    assert.strictEqual(this.isFungus, true);

    this.reporterCount++;
  }
};
