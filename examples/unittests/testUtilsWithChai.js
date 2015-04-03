var Utils = require('../../lib/util/utils.js');
var expect = require('chai').expect;

module.exports = {
  testFormatElapsedTime : function(client) {
    var resultMs = Utils.formatElapsedTime(999);
    var resultSec = Utils.formatElapsedTime(1999);
    var resultMin = Utils.formatElapsedTime(122299, true);

    expect(resultMs).to.equal('999ms');
    expect(resultSec).to.equal('1.999s');
    expect(resultMin).to.equal('2m 2s / 122299ms');
  },

  testMakeFnAsync : function(client) {
    function asynFn(done) {
      done();
    }

    function syncFn() {}

    expect(Utils.makeFnAsync(1, asynFn)).to.equal(asynFn);
  }
};