const SessionHandler = require('../session-handler.js');

module.exports = class JsonWireSessionHandler extends SessionHandler {
  parseResponse(data = {}) {
    if (!data.sessionId && data.value && data.value.capabilities) {
      return super.parseResponse(data);
    }

    if (data.value && data.value.error) {
      return {
        error: data.value
      };
    }

    return {
      sessionId: data.sessionId,
      capabilities: data.value || {}
    };
  }
};
