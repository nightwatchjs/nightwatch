const TransportActions = require('../actions.js');

module.exports = {
  ///////////////////////////////////////////////////////////
  // Session related
  ///////////////////////////////////////////////////////////
  sessionAction(action, sessionId) {
    let options = {
      path: '/session',
      method: action
    };

    if (sessionId) {
      options.path += `/${sessionId}`;
    }

    return options;
  },

  getSessions: '/sessions',
  getStatus: '/status',

  session: {
    ///////////////////////////////////////////////////////////
    // Timeouts
    ///////////////////////////////////////////////////////////
    setTimeoutType(type, value) {
      return TransportActions.post({
        path: '/timeouts',
        data: {
          type : type,
          ms : value
        }
      });
    },

    setTimeoutsAsyncScript(value) {
      return TransportActions.post({
        path: '/timeouts/async_script',
        data: {
          ms : value
        }
      });
    },

    setTimeoutsImplicitWait(value) {
      return TransportActions.post({
        path: '/timeouts/implicit_wait',
        data: {
          ms : value
        }
      });
    },

    getTimeouts: '/timeouts',

    ///////////////////////////////////////////////////////////
    // Session log
    ///////////////////////////////////////////////////////////
    getSessionLogTypes: '/log/types',

    getLogContents(type) {
      return TransportActions.post({
        path: '/log',
        data: {
          type: type
        }
      });
    },

    ///////////////////////////////////////////////////////////
    // Navigation
    ///////////////////////////////////////////////////////////
    navigateTo(url) {
      return TransportActions.post({
        path: '/url',
        data: {
          url: url
        }
      });
    },

    getCurrentUrl: '/url',
    navigateBack() {
      return TransportActions.post({
        path: '/back'
      });
    },
    navigateForward() {
      return TransportActions.post({
        path: '/forward'
      });
    },
    pageRefresh() {
      return TransportActions.post({
        path: '/refresh'
      });
    },
    getPageTitle: '/title',

    ///////////////////////////////////////////////////////////
    // Windows
    ///////////////////////////////////////////////////////////
    switchToWindow(handle) {
      return TransportActions.post({
        path: '/window',
        data: {
          name : handle
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

    minimizeWindow() {
      return TransportActions.post('/window/minimize');
    },

    fullscreenWindow() {
      return TransportActions.post('/window/fullscreen');
    },

    openNewWindow() {
      return TransportActions.post('/window/new');
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

    // windowRect commands are not available in JsonWire protocol but are used in W3C Webdriver actions
    // defining them here removes the need for error handlers in the case of JsonWire
    getWindowRect: '/window/rect',

    setWindowRect(data) {
      return TransportActions.post({
        path: '/window/rect',
        data
      });
    },

    ///////////////////////////////////////////////////////////
    // Frames
    ///////////////////////////////////////////////////////////
    switchToFrame(frameId) {
      if (frameId === undefined) {
        frameId = null;
      }

      return TransportActions.post({
        path: '/frame',
        data: {
          id: frameId
        }
      });
    },

    switchToParentFrame() {
      return TransportActions.post('/frame/parent');
    },

    ///////////////////////////////////////////////////////////
    // Elements
    ///////////////////////////////////////////////////////////
    locateSingleElement({using, value}) {
      return TransportActions.post({
        path: '/element',
        data: {
          using,
          value
        }
      });
    },

    locateMultipleElements({using, value}) {
      return TransportActions.post({
        path: '/elements',
        data: {
          using,
          value
        }
      });
    },

    elementIdEquals(id, otherId) {
      return `/element/${id}/equals/${otherId}`;
    },

    locateSingleElementByElementId({id, using, value}) {
      return TransportActions.post({
        path: `/element/${id}/element`,
        data: {
          using,
          value
        }
      });
    },

    locateMultipleElementsByElementId({id, using, value}) {
      return TransportActions.post({
        path: `/element/${id}/elements`,
        data: {
          using,
          value
        }
      });
    },

    getActiveElement() {
      return TransportActions.post('/element/active');
    },

    getElementAttribute(id, attributeName) {
      return `/element/${id}/attribute/${attributeName}`;
    },

    getElementCSSValue(id, cssPropertyName) {
      return `/element/${id}/css/${cssPropertyName}`;
    },

    getElementTagName(id) {
      return `/element/${id}/name`;
    },

    getElementSize(id) {
      return `/element/${id}/size`;
    },

    getElementText(id) {
      return `/element/${id}/text`;
    },

    getElementValue(id) {
      return `/element/${id}/attribute/value`;
    },

    getElementLocation(id) {
      return `/element/${id}/location`;
    },

    isElementLocationInView(id) {
      return `/element/${id}/location_in_view`;
    },

    isElementDisplayed(id) {
      return `/element/${id}/displayed`;
    },

    isElementEnabled(id) {
      return `/element/${id}/enabled`;
    },

    isElementSelected(id) {
      return `/element/${id}/selected`;
    },

    clearElementValue(id) {
      return TransportActions.post(`/element/${id}/clear`);
    },

    setElementValue(id, value) {
      if (Array.isArray(value)) {
        value = value.join('');
      } else {
        value = String(value);
      }

      return TransportActions.post({
        path: `/element/${id}/value`,
        data: {
          value: value.split('')
        }
      });
    },

    clickElement(id) {
      return TransportActions.post(`/element/${id}/click`);
    },

    elementSubmit(id) {
      return TransportActions.post(`/element/${id}/submit`);
    },

    sendKeys(keys) {
      return TransportActions.post({
        path: '/keys',
        data: {
          value: keys
        }
      });
    },

    ///////////////////////////////////////////////////////////
    // Document Handling
    ///////////////////////////////////////////////////////////
    getPageSource: '/source',

    executeScript(fn, args) {
      return TransportActions.post({
        path: '/execute',
        data: {
          script: fn,
          args: args
        }
      });
    },

    executeScriptAsync(fn, args) {
      return TransportActions.post({
        path: '/execute_async',
        data: {
          script: fn,
          args: args
        }
      });
    },

    ///////////////////////////////////////////////////////////
    // Cookies
    ///////////////////////////////////////////////////////////
    getCookieString: '/cookie',

    setCookieString(value) {
      return TransportActions.post({
        path: '/cookie',
        data: {
          cookie : value
        }
      });
    },

    deleteCookie(cookieName) {
      return TransportActions.delete(`/cookie/${cookieName}`);
    },

    deleteAllCookies() {
      return TransportActions.delete('/cookie');
    },

    ///////////////////////////////////////////////////////////
    // User Actions
    ///////////////////////////////////////////////////////////
    doubleClick() {
      return TransportActions.post('/doubleclick');
    },

    mouseButtonClick(buttonIndex) {
      return TransportActions.post({
        path: '/click',
        data: {
          button: buttonIndex
        }
      });
    },

    mouseButtonUp(buttonIndex) {
      return TransportActions.post({
        path: '/buttonup',
        data: {
          button: buttonIndex
        }
      });
    },

    mouseButtonDown(buttonIndex) {
      return TransportActions.post({
        path: '/buttondown',
        data: {
          button: buttonIndex
        }
      });
    },

    moveTo(id, xoffset, yoffset) {
      const data = {};

      if (typeof id == 'string') {
        data.element = id;
      }

      if (typeof xoffset == 'number') {
        data.xoffset = xoffset;
      }

      if (typeof yoffset == 'number') {
        data.yoffset = yoffset;
      }

      return TransportActions.post({
        path: '/moveto',
        data
      });
    },

    ///////////////////////////////////////////////////////////
    // User Prompts
    ///////////////////////////////////////////////////////////
    acceptAlert() {
      return TransportActions.post('/accept_alert');
    },

    dismissAlert() {
      return TransportActions.post('/dismiss_alert');
    },

    getAlertText: '/alert_text',

    setAlertText(value) {
      return TransportActions.post({
        path: '/alert_text',
        data: {
          text: value
        }
      });
    },

    ///////////////////////////////////////////////////////////
    // Screen
    ///////////////////////////////////////////////////////////
    getScreenshot(logBase64Data) {
      return {
        path: '/screenshot',
        addtOpts: {
          suppressBase64Data: !logBase64Data
        }
      };
    },

    getScreenOrientation: '/orientation',

    setScreenOrientation(orientation) {
      return TransportActions.post({
        path: '/orientation',
        data: {
          orientation : orientation
        }
      });
    },

    getAvailableContexts: '/contexts',

    getCurrentContext: '/context',

    setCurrentContext(context) {
      return TransportActions.post({
        path: '/context',
        data: {
          name: context
        }
      });
    }
  }

};
