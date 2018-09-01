const lodashMerge = require('lodash.merge');
const TransportActions = require('../actions.js');
const JsonWireActions = require('../jsonwire/actions.js');

module.exports = lodashMerge({}, JsonWireActions, {
  session: {
    ///////////////////////////////////////////////////////////
    // Windows
    ///////////////////////////////////////////////////////////
    switchToWindow(handle) {
      return TransportActions.post({
        path: '/window',
        data: {
          handle: handle
        }
      });
    }
  }
});