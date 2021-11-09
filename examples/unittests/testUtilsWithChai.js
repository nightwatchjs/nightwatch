const Utils = require('../../lib/utils/');
const expect = require('chai').expect;

module.exports = {
  testFormatElapsedTime: function() {
    var resultMs = Utils.formatElapsedTime(999);
    var resultSec = Utils.formatElapsedTime(1999);
    var resultMin = Utils.formatElapsedTime(122299, true);

    expect(resultMs).to.equal('999ms');
    expect(resultSec).to.equal('1.999s');
    expect(resultMin).to.equal('2m 2s / 122299ms');
  },

  testFormatElapsedTimeMore: function() {
    var resultMs = Utils.formatElapsedTime(999);
    expect(resultMs).to.equal('999ms');
  }
};