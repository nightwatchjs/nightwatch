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
    },

    closeWindow() {
      return TransportActions.delete('/window');
    },

    getWindowHandle: '/window_handle',

    getAllWindowHandles: '/window_handles',

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
    }
  }
});