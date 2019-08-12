const LocateStrategy = require('../element/strategy.js');
const Element = require('../element/element.js');
const Utils = require('../util/utils.js');

module.exports = class ProtocolActions {
  static get ScreenOrientation() {
    return ['LANDSCAPE', 'PORTRAIT'];
  }

  static get MouseButton() {
    return {
      LEFT: 'left',
      MIDDLE: 'middle',
      RIGHT: 'right'
    };
  }

  static get SessionActions() {
    return {
      GET: 'GET',
      POST: 'POST',
      DELETE: 'DELETE'
    };
  }

  static get TimeoutTypes() {
    return [
      'script',
      'implicit',
      'page load',
      'pageLoad'
    ];
  }

  static makePromise(cb, context, result) {
    const cbResult = cb.call(context, result);
    if (cbResult instanceof Promise) {
      return cbResult;
    }

    return result;
  }

  static validateElementId(id, apiMethod) {
    if (typeof id != 'string') {
      const err = new Error(`First argument passed to .${apiMethod}() should be a web element ID string. Received ${typeof id}.`);
      err.detailedErr = `See https://nightwatchjs.org/api/${apiMethod}.html\n`;
      throw err;
    }
  }

  get sessionId() {
    return this.nightwatchInstance.sessionId;
  }

  get transport() {
    return this.nightwatchInstance.transport;
  }

  get elementLocator() {
    return this.nightwatchInstance.elementLocator;
  }

  get TransportActions() {
    const self = this;

    return new Proxy(this.transport.Actions, {
      get(target, name) {
        return function (...args) {
          const callback = args.pop() || function () {};
          const definition = {
            args
          };

          let method;

          if (name in target.session) { // actions that require the current session
            method = target.session[name];
            definition.sessionId = self.sessionId;
          } else {
            method = target[name];
          }

          return method(definition).then(function(result) {
            if (typeof callback != 'function') {
              const err = new Error(`Callback passed to ${name}() command is not a function. ${typeof callback} given.`);
              args.push(callback);
              err.detailedErr = `Args: [${args.map(i => i === undefined ? '<undefined>' : i).join(', ')}]`;
              throw err;
            }

            return ProtocolActions.makePromise(callback, self.nightwatchInstance.api, result);
          });
        };
      }
    });
  }

  constructor(nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
  }

  get Actions() {
    return {
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Session related
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       * Get info about, delete or create a new session. Defaults to the current session.
       *
       * @example
       * this.demoTest = function (browser) {
       *    browser.session(function(result) {
       *      console.log(result.value);
       *    });
       *    //
       *    browser.session('delete', function(result) {
       *      console.log(result.value);
       *    });
       *    //
       *    browser.session('delete', '12345-abc', function(result) {
       *      console.log(result.value);
       *    });
       * }
       *
       *
       * @link /#new-session
       * @editline L141
       * @syntax .session([action], [sessionId], [callback])
       * @param {string} [action] The http verb to use, can be "get", "post" or "delete". If only the callback is passed, get is assumed by default.
       * @param {string} [sessionId] The id of the session to get info about or delete.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.sessions
       */
      session(action = ProtocolActions.SessionActions.GET, sessionId, callback) {
        if (arguments.length === 1 && typeof arguments[0] == 'function') {
          callback = arguments[0];
          action = ProtocolActions.SessionActions.GET;
        } else if (arguments[0] && !(arguments[0].toUpperCase() in ProtocolActions.SessionActions)) {
          sessionId = arguments[0];
          action = ProtocolActions.SessionActions.GET;
        }

        if (typeof arguments[1] === 'function') {
          callback = arguments[1];
          sessionId = this.sessionId;
        }

        action = action.toUpperCase();

        if (action !== ProtocolActions.SessionActions.POST && !sessionId) {
          sessionId = this.sessionId;
        }

        return this.TransportActions.sessionAction(action, sessionId, callback);
      },

      /**
       * Returns a list of the currently active sessions.
       *
       * @example
       *  this.demoTest = function (browser) {
       *    browser.sessions(function(result) {
       *      console.log(result.value);
       *    });
       * }
       *
       * @editline L166
       * @section sessions
       * @syntax .sessions(callback)
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.sessions
       */
      sessions(callback) {
        return this.TransportActions.getSessions(callback);
      },

      /**
       * Configure or retrieve the amount of time that a particular type of operation can execute for before they are aborted and a |Timeout| error is returned to the client.
       *
       * If called with only a callback as argument, the command will return the existing configured timeout values.
       *
       * @example
       *  this.demoTest = function (browser) {
       *    browser.timeouts('script', 10000, function(result) {
       *      console.log(result);
       *    });
       *
       *    browser.timeouts(function(result) {
       *      console.log('timeouts', result);
       *    });
       * }
       *
       * @link /#set-timeout
       * @editline L188
       * @syntax .timeouts([callback])
       * @syntax .timeouts(type, ms, [callback])
       * @section sessions
       * @param {string} type The type of operation to set the timeout for. Valid values are "script" for script timeouts, "implicit" for modifying the implicit wait timeout and "pageLoad" (or "page load" for legacy JsonWire) for setting a page load timeout.
       * @param {number} ms The amount of time, in milliseconds, that time-limited commands are permitted to run.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.sessions
       */
      timeouts(type, ms, callback) {
        if (Utils.isFunction(type) && arguments.length === 1 || arguments.length === 0) {
          return this.TransportActions.getTimeouts(type);
        }

        if (!ProtocolActions.TimeoutTypes.includes(type)) {
          throw new Error(`Invalid timeouts type value: ${type}. Accepted values are: ${ProtocolActions.TimeoutTypes.join(', ')}`);
        }

        if (typeof ms != 'number') {
          throw new Error(`Second argument to .timeouts() command must be a number. ${ms} given.`);
        }

        return this.TransportActions.setTimeoutType(type, ms, callback);
      },

      /**
       * Set the amount of time, in milliseconds, that asynchronous scripts executed by `.executeAsync` are permitted to run before they are aborted and a |Timeout| error is returned to the client.
       *
       * @example
       *  this.demoTest = function (browser) {
       *    browser.timeoutsAsyncScript(10000, function(result) {
       *      console.log(result);
       *    });
       * }
       *
       * @syntax .timeoutsAsyncScript(ms, [callback])
       * @jsonwire
       * @param {number} ms The amount of time, in milliseconds, that time-limited commands are permitted to run.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.sessions
       */
      timeoutsAsyncScript(ms, callback) {
        if (typeof ms != 'number') {
          throw new Error(`First argument to .timeoutsAsyncScript() command must be a number. ${typeof ms} given: ${ms}`);
        }

        return this.TransportActions.setTimeoutsAsyncScript(ms, callback);
      },

      /**
       * Set the amount of time the driver should wait when searching for elements. If this command is never sent, the driver will default to an implicit wait of 0ms.
       *
       * @example
       *  this.demoTest = function (browser) {
       *    browser.timeoutsImplicitWait(10000, function(result) {
       *      console.log(result);
       *    });
       * }
       *
       * @jsonwire
       * @syntax .timeoutsImplicitWait(ms, [callback])
       * @param {number} ms The amount of time, in milliseconds, that time-limited commands are permitted to run.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.sessions
       */
      timeoutsImplicitWait(ms, callback) {
        if (typeof ms != 'number') {
          throw new Error(`First argument to .timeoutsImplicitWait() command must be a number. ${typeof ms} given: ${ms}`);
        }

        return this.TransportActions.setTimeoutsImplicitWait(ms, callback);
      },

      /**
       * Query the server's current status.
       *
       * @link /status
       * @syntax .status([callback])
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.sessions
       */
      status(callback) {
        return this.TransportActions.getStatus(callback);
      },

      /**
       * Gets the text of the log type specified. To find out the available log types, use `.getLogTypes()`.
       *
       * Returns a [log entry JSON object](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#log-entry-json-object).
       *
       * @example
       *  this.demoTest = function (browser) {
       *    browser.sessionLog('client', function(result) {
       *      console.log(result.value);
       *    });
       * }
       *
       * @syntax .sessionLog(typeString, callback)
       * @param {string} typeString Type of log to request. Can be one of: client, driver, browser, server
       * @param {function} callback Callback function which is called with the result value.
       * @returns {Array} Array of the text entries of the log.
       * @api protocol.sessions
       */
      sessionLog(typeString, callback) {
        return this.TransportActions.getLogContents(typeString, callback);
      },

      /**
       * Gets an array of strings for which log types are available. This methods returns the entire WebDriver response, if you are only interested in the logs array, use `.getLogTypes()` instead.
       *
       * @example
       *  this.demoTest = function (browser) {
       *    browser.sessionLogTypes(function(result) {
       *      console.log(result.value);
       *    });
       * }
       *
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.sessions
       */
      sessionLogTypes(callback) {
        return this.TransportActions.getSessionLogTypes(callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Navigation
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      /**
       * Retrieve the URL of the current page or navigate to a new URL.
       *
       * @example
       * module.exports = {
       *  'demo Test' : function(browser) {
       *     browser.url(function(result) {
       *       // return the current url
       *       console.log(result);
       *     });
       *     //
       *     // navigate to new url:
       *     browser.url('{URL}');
       *     //
       *     //
       *     // navigate to new url:
       *     browser.url('{URL}', function(result) {
       *       console.log(result);
       *     });
       *   }
       * }
       *
       * @link /#go
       * @syntax .url([url], [callback])
       * @syntax .url(callback)
       * @param {string|function} [url] If missing, it will return the URL of the current page as an argument to the supplied callback.
       * @param {Function} [callback]
       * @api protocol.navigation
       */
      url(url, callback) {
        if (typeof url == 'string') {
          return this.TransportActions.navigateTo(url, callback);
        }

        return this.TransportActions.getCurrentUrl('/url', arguments[0]);
      },

      /**
       * Navigate backwards in the browser history, if possible.
       *
       * @link /#back
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.navigation
       */
      back(callback) {
        return this.TransportActions.navigateBack(callback);
      },

      /**
       * Navigate forwards in the browser history, if possible.
       *
       * @link /#forward
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.navigation
       */
      forward(callback) {
        return this.TransportActions.navigateForward(callback);
      },

      /**
       * Refresh the current page.
       *
       * @link /#refresh
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.navigation
       */
      refresh(callback) {
        return this.TransportActions.pageRefresh(callback);
      },

      /**
       * Get the current page title.
       *
       * @example
       *  this.demoTest = function (browser) {
       *    browser.title(function(result) {
       *      console.log(result.value);
       *    });
       * }
       *
       * @link /#get-title
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.navigation
       */
      title(callback) {
        return this.TransportActions.getPageTitle(callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Contexts
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       * Change focus to another window or close the current window. Shouldn't normally be used directly, instead `.switchWindow()` and `.closeWindow()` should be used.
       *
       * @link /#switch-to-window
       * @syntax .window(httpMethod, handleOrName, [callback])
       * @param {string} method The HTTP method to use. Can be either `POST` (change focus) or `DELETE` (close window).
       * @param {string} handleOrName The window to change focus to.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.window
       */
      window(method, handleOrName, callback) {
        method = method.toUpperCase();

        switch (method) {
          case 'POST':
            if (arguments.length < 2 || handleOrName === undefined) {
              throw new Error('POST requests to /window must include a name parameter also.');
            }

            return this.TransportActions.switchToWindow(handleOrName, callback);

          case 'DELETE':
            return this.TransportActions.closeWindow(arguments[1]);

          default:
            throw new Error('.window() method expects first argument to be either POST or DELETE.');
        }
      },

      /**
       * Retrieve the current window handle.
       *
       * @example
       *  this.demoTest = function (browser) {
       *    browser.windowHandle(function(result) {
       *      console.log(result.value);
       *    });
       * }
       *
       * @link /#get-window-handle
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.window
       */
      windowHandle(callback) {
        return this.TransportActions.getWindowHandle(callback);
      },

      /**
       * Retrieve the list of all window handles available to the session.
       *
       * @example
       *  this.demoTest = function (browser) {
       *    browser.windowHandles(function(result) {
       *      // An array of window handles.
       *      console.log(result.value);
       *    });
       * }
       *
       * @link /#get-window-handles
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.window
       */
      windowHandles(callback) {
        return this.TransportActions.getAllWindowHandles(callback);
      },

      /**
       * Increases the window to the maximum available size without going full-screen.
       *
       * @example
       * module.exports = {
       *  'demo Test with W3C Webdriver clients': function(browser) {
       *     // W3C Webdriver API doesn't require the window handle parameter anymore
       *     browser.windowMaximize(function(result) {
       *       console.log(result);
       *     });
       *   },
       *
       *   'ES6 async demo Test': async function(browser) {
       *     const result = await browser.windowMaximize();
       *     console.log('result value is:', result.value);
       *   },
       *
       *   'when using JSONWire (deprecated) clients': function(browser) {
       *      browser.windowMaximize('current', function(result) {
       *        console.log(result);
       *      });
       *   }
       * }
       *
       * @link /#dfn-maximize-window
       * @param {string} [handleOrName] Only required when using non-W3C Webdriver protocols (such as JSONWire). windowHandle URL parameter; if it is "current", the currently active window will be maximized.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.window
       */
      windowMaximize(handleOrName = 'current', callback) {
        return this.TransportActions.maximizeWindow(handleOrName, callback);
      },

      /**
       * Hides the window in the system tray. If the window happens to be in fullscreen mode, it is restored the normal state then it will be "iconified" - minimize or hide the window from the visible screen.
       *
       * @example
       * module.exports = {
       *  'demo Test': function(browser) {
       *     browser.minimizeWindow(function(result) {
       *       console.log(result);
       *     });
       *   },
       *
       *   'ES6 async demo Test': async function(browser) {
       *     const result = await browser.minimizeWindow();
       *     console.log('result value is:', result.value);
       *   }
       * }
       *
       * @link /#dfn-minimize-window
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.contexts
       */
      minimizeWindow(callback) {
        return this.TransportActions.minimizeWindow(callback);
      },

      /**
       * Sets the current window state to fullscreen.
       *
       * @example
       * module.exports = {
       *  'demo Test': function(browser) {
       *     browser.fullscreenWindow(function(result) {
       *       console.log(result);
       *     });
       *   },
       *
       *   'ES6 async demo Test': async function(browser) {
       *     const result = await browser.fullscreenWindow();
       *     console.log('result value is:', result.value);
       *   }
       * }
       *
       * @link /#dfn-fullscreen-window
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.contexts
       */
      fullscreenWindow(callback) {
        return this.TransportActions.fullscreenWindow(callback);
      },

      /**
       * Opens a new top-level browser window, which can be either a tab (default) or a separate new window.
       *
       * This command is only available for W3C Webdriver compatible browsers.
       *
       * @example
       * module.exports = {
       *  'demo Test': function(browser) {
       *     // open a new window tab (default)
       *     browser.openNewWindow(function(result) {
       *       console.log(result);
       *     });
       *
       *     // open a new window
       *     browser.openNewWindow('window', function(result) {
       *       console.log(result);
       *     });
       *   },
       *
       *   'ES6 async demo Test': async function(browser) {
       *     const result = await browser.fullscreenWindow();
       *     console.log('result value is:', result.value);
       *   }
       * }
       *
       * @link /#dfn-new-window
       * @param {string} [type] Can be either "tab" or "window", with "tab" set to default if none is specified.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.contexts
       */
      openNewWindow(type = 'tab', callback) {
        return this.TransportActions.openNewWindow(type, callback);
      },

      /**
       * Change or get the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect). This is defined as a dictionary of the `screenX`, `screenY`, `outerWidth` and `outerHeight` attributes of the window.
       *
       * Its JSON representation is the following:
       * - `x` - window's screenX attribute;
       * - `y` - window's screenY attribute;
       * - `width` - outerWidth attribute;
       * - `height` - outerHeight attribute.
       *
       * All attributes are in in CSS pixels. To change the window react, you can either specify `width` and `height`, `x` and `y` or all properties together.
       *
       * @example
       * module.exports = {
       *   'demo test .windowRect()': function(browser) {
       *
       *      // Change the screenX and screenY attributes of the window rect.
       *      browser.windowRect({x: 500, y: 500});
       *
       *      // Change the width and height attributes of the window rect.
       *      browser.windowRect({width: 600, height: 300});
       *
       *      // Retrieve the attributes
       *      browser.windowRect(function(result) {
       *        console.log(result.value);
       *      });
       *   },
       *
       *   'windowRect ES6 demo test': async function(browser) {
       *      const resultValue = await browser.windowRect();
       *      console.log('result value', resultValue);
       *   }
       * }
       *
       * @w3c
       * @link /#dfn-get-window-rect
       * @syntax .windowRect({width, height, x, y}, [callback]);
       * @param {object} options An object specifying either `width` and `height`, `x` and `y`, or all together to set properties for the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect).
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.window
       */
      windowRect(options, callback = function() {}) {
        if (arguments[0] === null) {
          return this.TransportActions.getWindowRect(callback);
        }

        const {width, height, x, y} = options;

        if (!Utils.isUndefined(width) && !Utils.isNumber(width)) {
          throw new Error(`Width argument passed to .windowRect() must be a number; received: ${typeof width} (${width}).`);
        }

        if (!Utils.isUndefined(height) && !Utils.isNumber(height)) {
          throw new Error(`Height argument passed to .windowRect() must be a number; received: ${typeof height} (${height}).`);
        }

        if (Utils.isNumber(width) && !Utils.isNumber(height) ||
          !Utils.isNumber(width) && Utils.isNumber(height)
        ) {
          throw new Error('Attributes "width" and "height" must be specified together.');
        }

        if (!Utils.isUndefined(x) && !Utils.isNumber(x)) {
          throw new Error(`X position argument passed to .windowRect() must be a number; received: ${typeof x} (${x}).`);
        }

        if (!Utils.isUndefined(y) && !Utils.isNumber(y)) {
          throw new Error(`Y position argument passed to .windowRect() must be a number; received: ${typeof y} (${y}).`);
        }

        if (Utils.isNumber(x) && !Utils.isNumber(y) ||
          !Utils.isNumber(x) && Utils.isNumber(y)
        ) {
          throw new Error('Attributes "x" and "y" must be specified together.');
        }

        return this.TransportActions.setWindowRect(arguments[0], callback);
      },

      /**
       * Change or get the position of the specified window. If the second argument is a function it will be used as a callback and the call will perform a get request to retrieve the existing window position.
       *
       * @example
       *  this.demoTest = function (browser) {
       *
       *    // Change the position of the specified window.
       *    // If the :windowHandle URL parameter is "current", the currently active window will be moved.
       *    browser.windowPosition('current', 0, 0, function(result) {
       *      console.log(result);
       *    });
       *
       *    // Get the position of the specified window.
       *    // If the :windowHandle URL parameter is "current", the position of the currently active window will be returned.
       *    browser.windowPosition('current', function(result) {
       *      console.log(result.value);
       *    });
       * }
       *
       * @see windowRect
       * @jsonwire
       * @param {string} windowHandle
       * @param {number} offsetX
       * @param {number} offsetY
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.window
       */
      windowPosition(windowHandle, offsetX, offsetY, callback) {
        if (typeof windowHandle !== 'string') {
          throw new Error('First argument must be a window handle string.');
        }

        if (arguments.length <= 2) {
          if (typeof arguments[1] != 'function') {
            throw new Error(`Second argument passed to .windowPosition() should be a callback when not passing offsetX and offsetY - ${typeof arguments[1]} given.`);
          }

          return this.TransportActions.getWindowPosition(windowHandle, arguments[1]);
        }

        offsetX = Number(offsetX);
        offsetY = Number(offsetY);

        if (typeof offsetX !== 'number' || isNaN(offsetX)) {
          throw new Error('offsetX argument passed to .windowPosition() must be a number.');
        }

        if (typeof offsetY !== 'number' || isNaN(offsetY)) {
          throw new Error('offsetY argument passed to .windowPosition() must be a number.');
        }

        return this.TransportActions.setWindowPosition(windowHandle, offsetX, offsetY, callback);
      },

      /**
       * Change or get the size of the specified window. If the second argument is a function it will be used as a callback and the call will perform a get request to retrieve the existing window size.
       *
       * @example
       *  this.demoTest = function (browser) {
       *
       *    // Return the size of the specified window. If the :windowHandle URL parameter is "current", the size of the currently active window will be returned.
       *    browser.windowSize('current', function(result) {
       *      console.log(result.value);
       *    });
       *
       *    // Change the size of the specified window.
       *    // If the :windowHandle URL parameter is "current", the currently active window will be resized.
       *    browser.windowSize('current', 300, 300, function(result) {
       *      console.log(result.value);
       *    });
       * }
       *
       * @see windowRect
       * @jsonwire
       * @param {string} windowHandle
       * @param {number} width
       * @param {number} height
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.window
       */
      windowSize(windowHandle, width, height, callback) {
        if (typeof windowHandle !== 'string') {
          throw new Error('First argument must be a window handle string.');
        }

        if (arguments.length <= 2) {
          if (typeof arguments[1] != 'function') {
            throw new Error(`Second argument passed to .windowSize() should be a callback when not passing width and height - ${typeof arguments[1]} given.`);
          }

          return this.TransportActions.getWindowSize(windowHandle, arguments[1]);
        }

        width = Number(width);
        height = Number(height);

        if (typeof width !== 'number' || isNaN(width)) {
          throw new Error('Width argument passed to .windowSize() must be a number.');
        }

        if (typeof height !== 'number' || isNaN(height)) {
          throw new Error('Height argument passed to .windowSize() must be a number.');
        }

        return this.TransportActions.setWindowSize(windowHandle, width, height, callback);
      },

      /**
       * Change focus to another frame on the page. If the frame id is missing or null, the server should switch to the page's default content.
       *
       * @example
       *  this.demoTest = function (browser) {
       *    browser.frame('<ID>', function(result) {
       *      console.log(result);
       *    });
       * }
       *
       * @link /#switch-to-frame
       * @param {string|number|null} [frameId] Identifier for the frame to change focus to.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.frames
       */
      frame(frameId, callback) {
        if (arguments.length === 1 && typeof frameId === 'function') {
          callback = frameId;

          return this.TransportActions.switchToFrame(callback);
        }

        return this.TransportActions.switchToFrame(frameId, callback);
      },

      /**
       * Change focus to the parent context. If the current context is the top level browsing context, the context remains unchanged.
       *
       * @example
       *  this.demoTest = function (browser) {
       *    browser.frameParent(function(result) {
       *      console.log(result);
       *    });
       * }
       *
       * @link /#switch-to-parent-frame
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @since v0.4.8
       * @api protocol.frames
       */
      frameParent(callback) {
        return this.TransportActions.switchToParentFrame(callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Element related
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       * Search for an element on the page, starting from the document root. The located element will be returned as a web element JSON object.
       * First argument to be passed is the locator strategy, which is detailed on the [WebDriver docs](https://www.w3.org/TR/webdriver/#locator-strategies).
       *
       * The locator stragy can be one of:
       * - `css selector`
       * - `link text`
       * - `partial link text`
       * - `tag name`
       * - `xpath`
       *
       * @example
       * module.exports = {
       *  'demo Test' : function(browser) {
       *     browser.element('css selector', 'body', function(result) {
       *       console.log(result.value)
       *     });
       *   },
       *
       *   'es6 async demo Test': async function(browser) {
       *     const result = await browser.element('css selector', 'body');
       *     console.log('result value is:', result.value);
       *   }
       * }
       *
       * @link /#find-element
       * @syntax .element(using, value, callback)
       * @editline L680
       * @param {string} using The locator strategy to use.
       * @param {string} value The search target.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elements
       */
      element(using, value, callback) {
        const commandName = 'element';
        if (using instanceof Element) {
          return this.findElements({
            element: using,
            callback: value,
            commandName
          });
        }

        return this.findElements({
          using, value, commandName, callback
        });
      },

      /**
       * Search for multiple elements on the page, starting from the document root. The located elements will be returned as web element JSON objects.
       * First argument to be passed is the locator strategy, which is detailed on the [WebDriver docs](https://www.w3.org/TR/webdriver/#locator-strategies).
       *
       * The locator strategy can be one of:
       * - `css selector`
       * - `link text`
       * - `partial link text`
       * - `tag name`
       * - `xpath`
       *
       * @example
       * module.exports = {
       *  'demo Test' : function(browser) {
       *     browser.elements('css selector', 'ul li', function(result) {
       *       console.log(result.value)
       *     });
       *   },
       *
       *   'es6 async demo Test': async function(browser) {
       *     const result = await browser.elements('css selector', 'ul li');
       *     console.log('result value is:', result.value);
       *   },
       *
       *   'page object demo Test': function (browser) {
       *      var nightwatch = browser.page.nightwatch();
       *      nightwatch
       *        .navigate()
       *        .assert.titleContains('Nightwatch.js');
       *
       *      nightwatch.api.elements('@featuresList', function(result) {
       *        console.log(result);
       *      });
       *
       *      browser.end();
       *   }
       * }
       *
       * @link /#find-elements
       * @syntax .elements(using, value, callback)
       * @editline L734
       * @param {string|null} using The locator strategy to use.
       * @param {string} value The search target.
       * @param {function} callback Callback function to be invoked with the result when the command finishes.
       * @api protocol.elements
       */
      elements(using, value, callback) {
        const commandName = 'elements';

        if (using instanceof Element) {
          return this.findElements({
            element: using,
            callback: value,
            commandName
          });
        }

        return this.findElements({
          using, value, commandName, callback
        });
      },

      /**
       * Test if two web element IDs refer to the same DOM element.
       *
       * This command is __deprecated__ and is only available on the [JSON Wire protocol](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidequalsother)
       *
       * @example
       * module.exports = {
       *  'demo Test' : function(browser) {
       *     browser.elementIdEquals('<ID-1>', '<ID-2>', function(result) {
       *       console.log(result.value)
       *     });
       *   }
       * }
       *
       * @link /#finding-elements-to-interact
       * @editline L772
       * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {string} otherId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the other element to compare against.
       * @param {function} callback Callback function which is called with the result value.
       * @internal
       * @api protocol.elements
       */
      elementIdEquals(webElementId, otherId, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdEquals');

        return this.TransportActions.elementIdEquals(webElementId, otherId, callback);
      },

      /**
       * Search for an element on the page, starting from the identified element. The located element will be returned as a Web Element JSON object.
       *
       * This command operates on a protocol level and requires a [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements). Read more on [Element retrieval](https://www.w3.org/TR/webdriver1/#element-retrieval) on the W3C WebDriver spec page.
       *
       * @example
       * module.exports = {
       *  'demo Test' : function(browser) {
       *     browser.elementIdElement('<WebElementId>', 'css selector', '.new-element', function(result) {
       *       console.log(result.value)
       *     });
       *   },
       *
       *   'es6 async demo Test': async function(browser) {
       *     const result = await browser.elementIdElement('<WebElementId>', 'css selector', '.new-element');
       *     console.log(result.value);
       *   },
       *
       *   'page object demo Test': function (browser) {
       *      var nightwatch = browser.page.nightwatch();
       *      nightwatch.navigate();
       *
       *      const navbarHeader = nightwatch.section.navbarHeader;
       *
       *      navbarHeader.api.elementIdElement('@versionDropdown', 'css selector', 'option', function(result) {
       *        browser.assert.ok(client.WEBDRIVER_ELEMENT_ID in result.value, 'The Webdriver Element Id is found in the result');
       *      });
       *   }
       * }
       *
       * @link /#find-element-from-element
       * @syntax .elementIdElement(webElementId, using, value, callback)
       * @editline L794
       * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {string} using The locator strategy to use.
       * @param {string} value The search target.
       * @param {function} callback Callback function which is called with the result value.
       * @internal
       * @api protocol.elements
       */
      elementIdElement(webElementId, using, value, callback = function() {}) {
        const commandName = 'elementIdElement';

        if (webElementId instanceof Element) {
          return this.findElements({
            parentElement: webElementId,
            callback,
            using,
            value,
            commandName
          });
        }

        ProtocolActions.validateElementId(webElementId, 'elementIdElement');
        LocateStrategy.validate(using, 'elementIdElement');

        return this.findElements({
          id: webElementId, using, value, commandName, callback
        });
      },

      /**
       * Search for multiple elements on the page, starting from the identified element. The located element will be returned as a web element JSON objects.
       *
       * @example
       * module.exports = {
       *  'demo Test' : function(browser) {
       *     browser.elementIdElements('<WebElementId>', 'css selector', 'ul li', function(result) {
       *       console.log(result.value)
       *     });
       *   },
       *
       *   'es6 async demo Test': async function(browser) {
       *     const result = await browser.elementIdElements('<WebElementId>', 'css selector', 'ul li');
       *     console.log(result.value);
       *   },
       *
       *   'page object demo Test': function (browser) {
       *      var nightwatch = browser.page.nightwatch();
       *      nightwatch.navigate();
       *
       *      const navbarHeader = nightwatch.section.navbarHeader;
       *
       *      navbarHeader.api.elementIdElements('@versionDropdown', 'css selector', 'option', function(result) {
       *        browser.assert.equal(result.value.length, 2, 'There are two option elements in the drop down');
       *      });
       *   }
       * }
       *
       *
       * @link /#find-elements-from-element
       * @syntax .elementIdElements(webElementId, using, value, callback)
       * @editline L840
       * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {string} using The locator strategy to use.
       * @param {string} value The search target.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elements
       * @internal
       */
      elementIdElements(webElementId, using, value, callback = function() {}) {
        const commandName = 'elementIdElements';

        if (webElementId instanceof Element) {
          return this.findElements({
            parentElement: webElementId,
            callback,
            using,
            value,
            commandName
          });
        }

        ProtocolActions.validateElementId(webElementId, 'elementIdElements');
        LocateStrategy.validate(using, 'elementIdElements');

        return this.findElements({
          id: webElementId, using, value, commandName, callback
        });
      },

      /**
       * Get the element on the page that currently has focus. The element will be returned as a [Web Element](https://www.w3.org/TR/webdriver1/#dfn-web-elements) JSON object.
       *
       * @example
       * module.exports = {
       *  'demo Test' : function(browser) {
       *     browser.elementActive(function(result) {
       *       console.log(result.value)
       *     });
       *   }
       * }
       *
       * @editline L866
       * @link /#get-active-element
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementstate
       * @internal
       */
      elementActive(callback) {
        return this.TransportActions.getActiveElement(callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Element State
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      /**
       * Get the value of an element's attribute.
       *
       * @link /#get-element-attribute
       * @param {string} webElementId ID of the element to route the command to.
       * @param {string} attributeName The attribute name
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementinternal
       * @internal
       */
      elementIdAttribute(webElementId, attributeName, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdAttribute');

        return this.TransportActions.getElementAttribute(webElementId, attributeName, callback);
      },

      /**
       * Retrieve the computed value of the given CSS property of the given element.
       *
       * The CSS property to query should be specified using the CSS property name, not the JavaScript property name (e.g. background-color instead of backgroundColor).
       *
       * @link /#get-element-css-value
       * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {string} cssPropertyName
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementinternal
       * @internal
       */
      elementIdCssProperty(webElementId, cssPropertyName, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdCssProperty');

        return this.TransportActions.getElementCSSValue(webElementId, cssPropertyName, callback);
      },

      /**
       * Scrolls into view a submittable element excluding buttons or editable element, and then attempts to clear its value, reset the checked state, or text content.
       *
       * @link /#dfn-element-clear
       * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.elementinternal
       * @internal
       */
      elementIdClear(webElementId, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdClear');

        return this.TransportActions.clearElementValue(webElementId, callback);
      },

      /**
       * Scrolls into view the element and clicks the in-view center point. If the element is not pointer-interactable, an <code>element not interactable</code> error is returned.
       *
       * @link /#element-click
       * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.elementinternal
       * @internal
       */
      elementIdClick(webElementId, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdClick');

        return this.TransportActions.clickElement(webElementId, callback);
      },

      /**
       * Determine if an element is currently displayed.
       *
       * @link /#element-displayedness
       * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementinternal
       * @internal
       */
      elementIdDisplayed(webElementId, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdDisplayed');

        return this.TransportActions.isElementDisplayed(webElementId, callback);
      },

      /**
       * Determine if an element is currently enabled.
       *
       * @link /#is-element-enabled
       * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementinternal
       * @internal
       */
      elementIdEnabled(webElementId, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdEnabled');

        return this.TransportActions.isElementEnabled(webElementId, callback);
      },

      /**
       * Determine an element's location on the screen once it has been scrolled into view.
       *
       * @link
        * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.elementinternal
       */
      elementIdLocationInView(webElementId, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdLocationInView');

        return this.TransportActions.isElementLocationInView(webElementId, callback);
      },

      /**
       * Determine an element's location on the page. The point (0, 0) refers to the upper-left corner of the page.
       *
       * The element's coordinates are returned as a JSON object with x and y properties.
       *
       * @link
        * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementinternal
       * @returns {object} The X and Y coordinates for the element on the page.
       */
      elementIdLocation(webElementId, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdLocation');

        return this.TransportActions.getElementLocation(webElementId, callback);
      },

      /**
       * Retrieve the qualified tag name of the given element.
       *
       * @link /#get-element-tag-name
       * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementinternal
       * @internal
       */
      elementIdName(webElementId, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdName');

        return this.TransportActions.getElementTagName(webElementId, callback);
      },

      /**
       * Determine if an OPTION element, or an INPUT element of type checkbox or radio button is currently selected.
       *
       * @link /#is-element-selected
       * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementinternal
       * @internal
       */
      elementIdSelected(webElementId, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdSelected');

        return this.TransportActions.isElementSelected(webElementId, callback);
      },

      /**
       * Determine an element's size in pixels. The size will be returned as a JSON object with width and height properties.
       *
       * @link
       * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementinternal
       * @internal
       */
      elementIdSize(webElementId, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdSize');

        return this.TransportActions.getElementSize(webElementId, callback);
      },

      /**
       * Returns the visible text for the element.
       *
       * @link /#get-element-text
       * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementinternal
       * @internal
       */
      elementIdText(webElementId, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdText');

        return this.TransportActions.getElementText(webElementId, callback);
      },

      /**
       * Scrolls into view the form control element and then sends the provided keys to the element, or returns the current value of the element. In case the element is not keyboard interactable, an <code>element not interactable error</code> is returned.
       *
       * @link /#element-send-keys
       * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {string|array|none} [value] Value to send to element in case of a POST
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementinternal
       * @internal
       */
      elementIdValue(webElementId, value, callback) {
        ProtocolActions.validateElementId(webElementId, 'elementIdValue');

        if (arguments.length === 1 || typeof arguments[1] == 'function') {
          callback = arguments[1] || function () {};

          return this.TransportActions.getElementAttribute(webElementId, 'value', callback);
        }

        return this.TransportActions.setElementValue(webElementId, value, callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Element Interaction
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       * Send a sequence of key strokes to the active element. The sequence is defined in the same format as the `sendKeys` command.
       * An object map with available keys and their respective UTF-8 characters, as defined on [W3C WebDriver draft spec](https://www.w3.org/TR/webdriver/#character-types), is loaded onto the main Nightwatch instance as `client.Keys`.
       *
       * Rather than the `setValue`, the modifiers are not released at the end of the call. The state of the modifier keys is kept between calls, so mouse interactions can be performed while modifier keys are depressed.
       *
       * @link
       * @param {Array} keysToSend The keys sequence to be sent.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.elementinteraction
       */
      keys(keysToSend, callback) {
        if (!Array.isArray(keysToSend)) {
          keysToSend = [keysToSend];
        }

        return this.TransportActions.sendKeys(keysToSend, callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Element Location
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      /**
       * Submit a FORM element. The submit command may also be applied to any element that is a descendant of a FORM element.
       *
       * @link
        * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.elementinternal
       */
      submit(webElementId, callback) {
        ProtocolActions.validateElementId(webElementId, 'submit');

        return this.TransportActions.elementSubmit(webElementId, callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Document Handling
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      /**
       * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be synchronous.
       * The script argument defines the script to execute in the form of a function body. The value returned by that function will be returned to the client.
       *
       * The function will be invoked with the provided args array and the values may be accessed via the arguments object in the order specified.
       *
       * Under the hood, if the `body` param is a function it is converted to a string with `<function>.toString()`. Any references to your current scope are ignored.
       *
       * To ensure cross-browser compatibility, the specified function should not be in ES6 format (i.e. `() => {}`). If the execution of the function fails, the first argument of the callback contains error information.
       *
       * @example
       *  this.demoTest = function (browser) {
       *    browser.execute(function(imageData) {
       *      // resize operation
       *      return true;
       *    }, [imageData], function(result) {
       *      // result.value === true
       *    });
       * }
       *
       * @link /#executing-script
       * @param {string|function} body The function body to be injected.
       * @param {Array} args An array of arguments which will be passed to the function.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.document
       * @returns {*} The script result.
       */
      execute(...args) {
        args.unshift('executeScript');

        return this.executeScriptHandler(...args);
      },

      /**
       * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be asynchronous.
       *
       * The function to be injected receives the `done` callback as argument which needs to be called when the asynchronous operation finishes. The value passed to the `done` callback is returned to the client.
       * Additional arguments for the injected function may be passed as a non-empty array which will be passed before the `done` callback.
       *
       * Asynchronous script commands may not span page loads. If an unload event is fired while waiting for the script result, an error will be returned.
       *
       * @example
       *  this.demoTest = function (browser) {
       *    browser.executeAsync(function(done) {
       *      setTimeout(function() {
       *        done(true);
       *      }, 500);
       *    }, function(result) {
       *      // result.value === true
       *    });
       *
       *    browser.executeAsync(function(arg1, arg2, done) {
       *      setTimeout(function() {
       *        done(true);
       *      }, 500);
       *    }, [arg1, arg2], function(result) {
       *      // result.value === true
       *    });
       * }
       *
       * @link /#execute-async-script
       * @param {string|function} script The function body to be injected.
       * @param {Array} args An array of arguments which will be passed to the function.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.document
       * @returns {*} The script result.
       */
      executeAsync(...args) {
        args.unshift('executeScriptAsync');

        return this.executeScriptHandler(...args);
      },

      /**
       * Returns a string serialisation of the DOM of the current page.
       *
       * @link /#getting-page-source
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.document
       */
      source(callback) {
        return this.TransportActions.getPageSource(callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Cookies
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       * Retrieve or delete all cookies visible to the current page or set a cookie. Normally this shouldn't be used directly, instead the cookie convenience methods should be used: <code>getCookie</code>, <code>getCookies</code>, <code>setCookie</code>, <code>deleteCookie</code>, <code>deleteCookies</code>.
       *
       * @link /#cookies
       * @param {string} method Http method
       * @param {function|object} [callbackOrCookie] Optional callback function to be called when the command finishes.
       * @see getCookies
       * @see getCookie
       * @see setCookie
       * @see deleteCookie
       * @see deleteCookies
       * @api protocol.cookies
       */
      cookie(method, callbackOrCookie) {
        switch (method) {
          case 'GET':
            return this.TransportActions.getCookieString(callbackOrCookie);

          case 'POST':
            if (arguments.length < 2) {
              throw new Error('POST requests to /cookie must include a cookie object parameter also.');
            }

            return this.TransportActions.setCookieString(callbackOrCookie, arguments[2]);

          case 'DELETE':
            if (typeof callbackOrCookie === 'undefined' || typeof callbackOrCookie === 'function') {
              return this.TransportActions.deleteAllCookies(callbackOrCookie);
            }

            return this.TransportActions.deleteCookie(callbackOrCookie, arguments[2]);

          default:
            throw new Error('This method expects first argument to be either GET, POST or DELETE.');
        }
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // User Actions
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       * Double-clicks at the current mouse coordinates (set by `.moveTo()`).
       *
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.useractions
       */
      doubleClick(callback) {
        return this.TransportActions.doubleClick(callback);
      },

      /**
       * Click at the current mouse coordinates (set by `.moveTo()`).
       *
       * The button can be (0, 1, 2) or ('left', 'middle', 'right'). It defaults to left mouse button.
       *
       * @link
       * @param {string|number} button The mouse button
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.useractions
       */
      mouseButtonClick(button, callback) {
        let buttonIndex;

        if (arguments.length === 0) {
          button = 0;
        } else {
          if (typeof(button) === 'function') {
            callback = arguments[0];
            button = 0;
          }

          if (typeof button === 'string') {
            buttonIndex = [
              ProtocolActions.MouseButton.LEFT,
              ProtocolActions.MouseButton.MIDDLE,
              ProtocolActions.MouseButton.RIGHT
            ].indexOf(button.toLowerCase());

            if (buttonIndex !== -1) {
              button = buttonIndex;
            }
          }
        }

        return this.TransportActions.mouseButtonClick(button, callback);
      },

      /**
       * Click and hold the left mouse button (at the coordinates set by the last `moveTo` command). Note that the next mouse-related command that should follow is `mouseButtonUp` . Any other mouse command (such as click or another call to buttondown) will yield undefined behaviour.
       *
       * Can be used for implementing drag-and-drop. The button can be (0, 1, 2) or ('left', 'middle', 'right'). It defaults to left mouse button, and if you don't pass in a button but do pass in a callback, it will handle it correctly.
       *
       * @link
       * @param {string|number} button The mouse button
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.useractions
       */
      mouseButtonDown(button, callback) {
        return this.mouseButtonHandler('mouseButtonDown', button, callback);
      },

      /**
       * Releases the mouse button previously held (where the mouse is currently at). Must be called once for every `mouseButtonDown` command issued.
       *
       * Can be used for implementing drag-and-drop. The button can be (0, 1, 2) or ('left', 'middle', 'right'). It defaults to left mouse button, and if you don't pass in a button but do pass in a callback, it will handle it correctly.
       *
       * @link
       * @param {string|number} button The mouse button
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.useractions
       */
      mouseButtonUp(button, callback) {
        return this.mouseButtonHandler('mouseButtonUp', button, callback);
      },

      /**
       * Move the mouse by an offset of the specified [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) or relative to the current mouse cursor, if no element is specified. If an element is provided but no offset, the mouse will be moved to the center of the element.
       *
       * If an element is provided but no offset, the mouse will be moved to the center of the element. If the element is not visible, it will be scrolled into view.
       *
       * @example
       * this.demoTest = function (browser) {
       *   browser.moveTo(null, 110, 100);
       * };
       *
       * @syntax .moveTo([webElementId], xoffset, yoffset, [callback])
       * @syntax .moveTo(null, xoffset, yoffset, [callback])
       * @editline L1335
       * @param {string} [webElementId] The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) assigned to the element to move to. If not specified or is null, the offset is relative to current position of the mouse.
       * @param {number} xoffset X offset to move to, relative to the top-left corner of the element. If not specified, the mouse will move to the middle of the element.
       * @param {number} yoffset Y offset to move to, relative to the top-left corner of the element. If not specified, the mouse will move to the middle of the element.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.useractions
       */
      moveTo(webElementId, xoffset, yoffset, callback) {
        return this.TransportActions.moveTo(webElementId, xoffset, yoffset, callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // User Prompts
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       * Accepts the currently displayed alert dialog. Usually, this is equivalent to clicking on the 'OK' button in the dialog.
       *
       * @link /#accept-alert
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.userprompts
       */
      acceptAlert(callback) {
        return this.TransportActions.acceptAlert(callback);
      },

      /**
       * Dismisses the currently displayed alert dialog. For confirm() and prompt() dialogs, this is equivalent to clicking the 'Cancel' button.
       *
       * For alert() dialogs, this is equivalent to clicking the 'OK' button.
       *
       * @link /#dismiss-alert
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.userprompts
       */
      dismissAlert(callback) {
        return this.TransportActions.dismissAlert(callback);
      },

      /**
       * Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.
       *
       * @link /#get-alert-text
       * @param {function} callback Callback function which is called with the result value.
       * @returns {string} The text of the currently displayed alert.
       * @api protocol.userprompts
       */
      getAlertText(callback) {
        return this.TransportActions.getAlertText(callback);
      },

      /**
       * Sends keystrokes to a JavaScript prompt() dialog.
       *
       * @link /#send-alert-text
       * @param {string} value Keystrokes to send to the prompt() dialog
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.userprompts
       */
      setAlertText(value, callback) {
        return this.TransportActions.setAlertText(value, callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Screen Capture
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       * Take a screenshot of the current page.
       *
       * @link /#take-screenshot
       * @param {boolean} log_screenshot_data Whether or not the screenshot data should appear in the logs when running with --verbose
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.screens
       */
      screenshot(log_screenshot_data = false, callback = function() {}) {
        return this.TransportActions.getScreenshot(log_screenshot_data, callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Mobile related
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       * Get the current browser orientation.
       *
       * @param {function} callback Callback function which is called with the result value.
       * @returns {string} The current browser orientation: {LANDSCAPE|PORTRAIT}
       * @api protocol.mobile
       */
      getOrientation(callback) {
        return this.TransportActions.getScreenOrientation(callback);
      },

      /**
       * Sets the browser orientation.
       *
       * @param {string} orientation The new browser orientation: {LANDSCAPE|PORTRAIT}
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.mobile
       */
      setOrientation(orientation, callback) {
        orientation = orientation.toUpperCase();

        if (!ProtocolActions.ScreenOrientation.includes(orientation)) {
          throw new Error('Invalid screen orientation value specified. Accepted values are: ' + ProtocolActions.ScreenOrientation.join(', '));
        }

        return this.TransportActions.setScreenOrientation(orientation, callback);
      },

      /**
       * Get a list of the available contexts.
       *
       * Used by Appium when testing hybrid mobile web apps. More info here: https://github.com/appium/appium/blob/master/docs/en/advanced-concepts/hybrid.md.
       *
       * @param {function} callback Callback function to be called when the command finishes.
       * @returns {Array} an array of strings representing available contexts, e.g 'WEBVIEW', or 'NATIVE'
       * @api protocol.mobile
       */
      contexts(callback) {
        return this.TransportActions.getAvailableContexts(callback);
      },

      /**
       *
       * Get current context.
       *
       * @param {function} callback Callback function to be called when the command finishes.
       * @returns {string|null} a string representing the current context or `null`, representing "no context"
       * @api protocol.mobile
       */
      currentContext(callback) {
        return this.TransportActions.getCurrentContext(callback);
      },

      /**
       * Sets the context.
       *
       * @param {string} context context name to switch to - a string representing an available context.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.mobile
       */
      setContext(context, callback) {
        return this.TransportActions.setCurrentContext(context, callback);
      }
    };
  }

  /*!
   *
   * @param {Element} [element]
   * @param {Element} [parentElement]
   * @param {String} [id]
   * @param {String} using
   * @param {String} value
   * @param {function} [callback]
   *
   * @return {Promise}
   */
  findElements({element, parentElement, id, using, value, commandName, callback = function() {}}) {
    if (!(element instanceof Element)) {
      try {
        element = Element.createFromSelector(value, using);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    if (!element.usingRecursion) {
      LocateStrategy.validate(element.locateStrategy, commandName);
    }

    return this.locate({id, element, parentElement, commandName})
      .then(result => {
        return ProtocolActions.makePromise(callback, this.nightwatchInstance.api, result);
      });
  }

  /*!
   *
   * @param {Element} element
   * @param {string} protocolCommand either "elements"(multiple) or "element"(single)
   */
  async locate({id, element, parentElement, commandName}) {
    let transportAction;

    switch (commandName) {
      case 'element':
        transportAction = 'locateSingleElement';
        break;
      case 'elements':
        transportAction = 'locateMultipleElements';
        break;
      case 'elementIdElements':
        transportAction = 'locateMultipleElementsByElementId';
        break;
      case 'elementIdElement':
        transportAction = 'locateSingleElementByElementId';
        break;
    }

    if (element.usingRecursion) {
      return this.elementLocator.findElement({element, transportAction});
    }

    if (parentElement) {
      let elementResponse = await this.elementLocator.findElement({element: parentElement});
      if (!elementResponse.value) {
        return {
          value: null,
          status: -1,
          err: new Error(`No element found for ${parentElement}.`)
        };
      }

      id = elementResponse.value;
    }

    return this.elementLocator.executeProtocolAction({id, element, transportAction, commandName});
  }

  /*!
   * Helper function for execute and execute_async
   *
   * @param {string} path
   * @param {string|function} script
   * @param {Array} args
   * @param {function} callback
   * @private
   */
  executeScriptHandler(method, script, args, callback) {
    let fn;

    if (typeof script === 'function') {
      fn = 'var passedArgs = Array.prototype.slice.call(arguments,0); return ' +
        script.toString() + '.apply(window, passedArgs);';
    } else {
      fn = script;
    }

    if (arguments.length === 2) {
      args = [];
    } else if (arguments.length === 3 && typeof arguments[2] === 'function') {
      callback = arguments[2];
      args = [];
    }

    return this.TransportActions[method](fn, args, callback);
  }

  /*!
   * Helper function for mouseButton actions
   *
   * @param {string} handler
   * @param {string|number} button
   * @param {function} callback
   * @private
   */
  mouseButtonHandler(handler, button, callback) {
    let buttonIndex;

    if (typeof(button) === 'function') {
      callback = button;
      button = 0;
    }

    if (typeof button === 'string') {
      buttonIndex = [
        ProtocolActions.MouseButton.LEFT,
        ProtocolActions.MouseButton.MIDDLE,
        ProtocolActions.MouseButton.RIGHT
      ].indexOf(button.toLowerCase());

      if (buttonIndex !== -1) {
        button = buttonIndex;
      }
    }

    return this.TransportActions[handler](button, callback);
  }
};
