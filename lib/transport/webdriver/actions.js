const lodashMerge = require('lodash.merge');
const TransportActions = require('../actions.js');
const JsonWireActions = require('../jsonwire/actions.js');

module.exports = lodashMerge({}, JsonWireActions, {
  session: {
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
          handle: handle
        }
      });
    },

    getWindowHandle: '/window/handle',

    getAllWindowHandles: '/window/handles',

    getWindowPosition(windowHandle) {
      return `/window/${windowHandle}/position`;
    },

    maximizeWindow(windowHandle) {
      return TransportActions.post(`/window/${windowHandle}/maximize`);
    },

    setWindowPosition(windowHandle, offsetX, offsetY) {
      return TransportActions.post({
        path: `/window/${windowHandle}/position`,
        data: {
          x : offsetX,
          y : offsetY
        }
      });
    },

    getWindowSize(windowHandle) {
      return `/window/${windowHandle}/size`;
    },

    setWindowSize(windowHandle, width, height) {
      return TransportActions.post({
        path: `/window/${windowHandle}/size`,
        data: {
          width : width,
          height : height
        }
      });
    },

    ///////////////////////////////////////////////////////////
    // Frames
    ///////////////////////////////////////////////////////////
    switchToFrame(frameId) {
      if (frameId) {
        return TransportActions.post({
          path: '/frame',
          data: {
            id: frameId
          }
        });
      }

      return TransportActions.post('/frame');
    },

    switchToParentFrame() {
      return TransportActions.post('/frame/parent');
    },

    setElementValue(id, value) {
      return TransportActions.post({
        path: `/element/${id}/value`,
        data: {
          text: value
        }
      });
    },

    executeScript(fn, args) {
      return TransportActions.post({
        path: '/execute/sync',
        data: {
          script: fn,
          args: args
        }
      });
    },

    executeScriptAsync(fn, args) {
      return TransportActions.post({
        path: '/execute/async',
        data: {
          script: fn,
          args: args
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

    setAlertText(value) {
      return TransportActions.post({
        path: '/alert/text',
        data: {
          text: value
        }
      });
    },
  }
});