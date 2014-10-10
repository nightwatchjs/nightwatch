var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Utils = require('../../' + BASE_PATH +'/util/utils.js');

module.exports = {
  testFormatElapsedTime : function(test) {

    var resultMs = Utils.formatElapsedTime(999);
    test.equals(resultMs, '999ms');

    var resultSec = Utils.formatElapsedTime(1999);
    test.equals(resultSec, '1.999s');

    var resultMin = Utils.formatElapsedTime(122299);
    test.equals(resultMin, '2m 2s / 122299ms');

    test.done();

  }
};

