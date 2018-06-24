const lodashMerge = require('lodash.merge');
const ProtocolActions = require('../actions.js').ProtocolActions;

const JsonWireActions = require('../jsonwire/actions.js');

module.exports = lodashMerge(JsonWireActions, {
  session: {
    ///////////////////////////////////////////////////////////
    // Windows
    ///////////////////////////////////////////////////////////
    switchToWindow(handle) {
      return ProtocolActions.post({
        path: '/window',
        data: {
          handle: handle
        }
      });
    },

    closeWindow() {
      return ProtocolActions.delete('/window');
    },

    getWindowHandle: '/window_handle',

    getAllWindowHandles: '/window_handles',

    getWindowPosition(windowHandle) {
      return `/window/${windowHandle}/position`;
    },

    maximizeWindow(windowHandle) {
      return ProtocolActions.post(`/window/${windowHandle}/maximize`);
    },

    setWindowPosition(windowHandle, offsetX, offsetY) {
      return ProtocolActions.post({
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
      return ProtocolActions.post({
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
        return ProtocolActions.post({
          path: '/frame',
          data: {
            id: frameId
          }
        });
      }

      return ProtocolActions.post('/frame');
    },

    switchToParentFrame() {
      return ProtocolActions.post('/frame/parent');
    },

    setElementValue(id, value) {
      return ProtocolActions.post({
        path: `/element/${id}/value`,
        data: {
          text: value
        }
      });
    }
  }
});