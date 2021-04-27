const lodashMerge = require('lodash.merge');
const TransportActions = require('../actions.js');
const JsonWireMappings = require('../jsonwire/method-mappings.js');

module.exports = lodashMerge({}, JsonWireMappings, {
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
