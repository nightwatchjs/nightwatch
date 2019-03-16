const assert = require('assert');

module.exports = {
  reporter(results) {
    assert.ok('modules' in results);
    assert.strictEqual(this.reporterCount, 0);

    this.reporterCount++;
  }
};
