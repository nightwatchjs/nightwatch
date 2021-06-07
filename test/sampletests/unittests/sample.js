var assert = require('assert');
module.exports = {
  demoTestSync() {
    assert.strictEqual(0, 0);
  },

  demoTestAsync(done) {
    setTimeout(function () {
      done();
    }, 10);
  }
};
