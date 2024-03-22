const common = require('../../../common.js');
const Session = common.require('core/session.js');

class MockSession extends Session {
  getSessionId() {
    return '1352110219202';
  }

  get commandQueue() {
    return {
      add({commandName, commandFn, context, args, stackTrace}) {
        commandFn({args, stackTrace});
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
