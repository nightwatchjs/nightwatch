const common = require('../../../common.js');

module.exports = function(assertCallback) {

  const NightwatchAssertion = common.require('core/assertion.js');

  class NightwatchAssertionMock extends NightwatchAssertion {
    runAssertion(passed, value, calleeFn, message) {
      super.assert(passed, value, calleeFn, message);

      assertCallback.call(this, passed, value, calleeFn, message);
    }
  }

  return NightwatchAssertionMock;
};