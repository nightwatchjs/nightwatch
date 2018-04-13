const assert = require('assert');

module.exports = {
  '@unitTest' : true,

  'demo UnitTest' : function (done) {
    assert.equal('TEST', 'TEST');
    setTimeout(function() {
      done();
    }, 10);
  }
};
