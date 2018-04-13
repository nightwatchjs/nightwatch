var assert = require('assert');
module.exports = {
  demoTestSync() {
    assert.equal(0, 0);
  },

  demoTestAsync(done) {
    setTimeout(function () {
      done();
    }, 10);
  }
};
