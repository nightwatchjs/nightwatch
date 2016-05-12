var assert = require('assert');
module.exports = {
  demoTestSync : function (test) {
    assert.equal(0, 0);
  },

  demoTestAsync : function(test, done) {
    setTimeout(function () {
      done();
    }, 10);
  }
};
