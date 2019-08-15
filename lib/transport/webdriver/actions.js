const lodashMerge = require('lodash.merge');
const TransportActions = require('../actions.js');
const JsonWireActions = require('../jsonwire/actions.js');

module.exports = lodashMerge({}, JsonWireActions, {
  session: {

    setTimeoutType(type, ms, callback) {
      let buildData = {};
      switch(type) {
        case 'script':
          buildData = { 'script' : ms};
          break;
        case 'page load':
          buildData = { 'pageLoad' : ms};
          break;
        case 'implicit':
          buildData = { 'implicit' : ms};
          break;
      }
      return TransportActions.post({
        path: '/timeouts',
        data: buildData
      });
    },

    setTimeoutsAsyncScript(ms, callback) {
      return TransportActions.post({
        path: '/timeouts', data: { 'script' : ms}});
    },

    setTimeoutsImplicitWait(ms, callback) {
      return TransportActions.post({
        path: '/timeouts', data: { 'implicit' : ms}});
    },

    getTimeouts() {
      return '/timeouts';
    },

    clickElement(id) {
      return TransportActions.post({
        path: `/element/${id}/click`,
        data: {
          id: id
        }
      });
    },

    clearElementValue(id) {
      return TransportActions.post({
        path: `/element/${id}/clear`,
        data: {
          id: id
        }
      });
    },

    ///////////////////////////////////////////////////////////
    // Windows
    ///////////////////////////////////////////////////////////
    switchToWindow(handle) {
      return TransportActions.post({
        path: '/window',
        data: {
          handle
        }
      });
    },

    getWindowHandle: '/window',
    getAllWindowHandles: '/window/handles',

    openNewWindow(type = 'tab') {
      return TransportActions.post({
        path: '/window/new',
        data: {
          type
        }
      });
    },

    getWindowPosition: '/window/rect',
    getWindowSize: '/window/rect',

    maximizeWindow(windowHandle, callback) {
      return TransportActions.post({
        path: '/window/maximize'
      });
    },

    setWindowPosition(windowHandle, x, y) {
      return TransportActions.post({
        path: '/window/rect',
        data: {
          x,
          y
        }
      });
    },

    setWindowSize(windowHandle, width, height) {
      return TransportActions.post({
        path: '/window/rect',
        data: {
          width,
          height
        }
      });
    },

    ///////////////////////////////////////////////////////////
    // Frames
    ///////////////////////////////////////////////////////////
    switchToFrame(id) {
      if (id) {
        return TransportActions.post({
          path: '/frame',
          data: {
            id
          }
        });
      }

      return TransportActions.post('/frame');
    },

    switchToParentFrame() {
      return TransportActions.post('/frame/parent');
    },

    setElementValue(id, text) {
      return TransportActions.post({
        path: `/element/${id}/value`,
        data: {
          text
        }
      });
    },

    executeScript(script, args) {
      return TransportActions.post({
        path: '/execute/sync',
        data: {
          script,
          args
        }
      });
    },

    executeScriptAsync(script, args) {
      return TransportActions.post({
        path: '/execute/async',
        data: {
          script,
          args
        }
      });
    },

    ///////////////////////////////////////////////////////////
    // User Prompts
    ///////////////////////////////////////////////////////////
    acceptAlert() {
      return TransportActions.post('/alert/accept');
    },

    dismissAlert() {
      return TransportActions.post('/alert/dismiss');
    },

    getAlertText: '/alert/text',

    setAlertText(text) {
      return TransportActions.post({
        path: '/alert/text',
        data: {
          text
        }
      });
    },
  }
});
