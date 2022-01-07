const assert = require('assert');

module.exports = {
  '@unitTest': true,

  'demo UnitTest': function (done) {
    assert.strictEqual('TEST', 'TEST');
    setTimeout(function() {
      done();
    }, 10);
  }
};
