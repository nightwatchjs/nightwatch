const assert = require('assert');

module.exports = {
  '@unitTest' : true,
  '@skipTestcasesOnFail' : false,

  'demo UnitTest' : function (done) {
    assert.equal('TEST', 'TEST');
    throw new Error('XX')
    setTimeout(function() {
      done();
    }, 100);

  },

  '22 demo UnitTest' : function () {
    assert.equal('ASB', 'ASB');
    assert.equal('ASB', 'ASB');
  }
};
