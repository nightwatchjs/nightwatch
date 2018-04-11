var assert = require('assert');
module.exports = {
  demoTestSync : function (done) {
    assert.equal(0, 0);
    done();
  },

  demoTestAsync : function(test, done) {
    setTimeout(function () {
      done();
    }, 10);
  }
};
