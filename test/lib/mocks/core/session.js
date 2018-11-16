const common = require('../../../common.js');
const Session = common.require('core/session.js');

class MockSession extends Session {
  getSessionId() {
    return '1352110219202';
  }

  get commandQueue() {
    return {
      add(commandName, command, context, args, originalStackTrace) {
        command(...args);
      },

      empty() {
        return this;
      },

      reset() {
        return this;
      }
    };
  }
}

module.exports = MockSession;