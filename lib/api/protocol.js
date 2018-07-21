const LocateStrategy = require('../util/locatestrategy.js');
const Element = require('../page-object/element.js');
const Logger = require('../util/logger.js');

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
      'page load'
    ];
  }

  get sessionId() {
    return this.nightwatchInstance.sessionId;
  }

  get Transport() {
    return this.nightwatchInstance.transport;
  }

  get TransportActions() {
    const self = this;

    return new Proxy(this.Transport.Actions, {
      get(target, name) {
        return function (...args) {
          const callback = args.pop() || function () {};
          const definition = {
            args: args
          };

          let method;

          if (name in target.session) { // actions that require the current session
            method = target.session[name];
            definition.sessionId = self.sessionId;
          } else {
            method = target[name];
          }

          return method(definition).then(result => {
            callback.call(self.nightwatchInstance.api, result);

            return result;
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
       * ```
       *  this.demoTest = function (browser) {
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
       * ```
       *
       * @link /#new-session
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
       * ```
       *  this.demoTest = function (browser) {
       *    browser.sessions(function(result) {
       *      console.log(result.value);
       *    });
       * }
       * ```
       *
       * @section sessions
       * @syntax .sessions(callback)
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.sessions
       */
      sessions(callback) {
        return this.TransportActions.getSessions(callback);
      },

      /**
       * Configure the amount of time that a particular type of operation can execute for before they are aborted and a |Timeout| error is returned to the client.
       *
       * @link /#set-timeout
       * @syntax .timeouts(type, ms, [callback])
       * @section sessions
       * @param {string} type The type of operation to set the timeout for. Valid values are: "script" for script timeouts, "implicit" for modifying the implicit wait timeout and "page load" for setting a page load timeout.
       * @param {number} ms The amount of time, in milliseconds, that time-limited commands are permitted to run.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.sessions
       */
      timeouts(type, ms, callback) {
        if (ProtocolActions.TimeoutTypes.indexOf(type) === -1) {
          throw new Error(`Invalid timeouts type value: ${type}. Accepted values are: ${ProtocolActions.TimeoutTypes.join(', ')}`);
        }

        if (typeof ms != 'number') {
          throw new Error(`Second argument to .timeouts() command must be a number. ${typeof ms} given: ${ms}`);
        }

        return this.TransportActions.setTimeoutType(type, ms, callback);
      },

      /**
       * Set the amount of time, in milliseconds, that asynchronous scripts executed by `.executeAsync` are permitted to run before they are aborted and a |Timeout| error is returned to the client.
       *
       * @syntax .timeoutsAsyncScript(ms, [callback])
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
       * @link
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
       * @syntax .sessionLog(typeString, callback)
       * @param {string} typeString Type of log to request.
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
       * ```
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
       *}
       * ```
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
       * @api protocol.contexts
       */
      window(method, handleOrName, callback) {
        method = method.toUpperCase();

        switch (method) {
          case 'POST':
            if (arguments.length < 2) {
              throw new Error('POST requests to /window must include a name parameter also.');
            }

            return this.TransportActions.switchToWindow(handleOrName, callback);

          case 'DELETE':
            return this.TransportActions.closeWindow(arguments[1]);

          default:
            throw new Error('This method expects first argument to be either POST or DELETE.');
        }
      },

      /**
       * Retrieve the current window handle.
       *
       * @link /#get-window-handle
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.contexts
       */
      windowHandle(callback) {
        return this.TransportActions.getWindowHandle(callback);
      },

      /**
       * Retrieve the list of all window handles available to the session.
       *
       * @link /#get-window-handles
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.contexts
       */
      windowHandles(callback) {
        return this.TransportActions.getAllWindowHandles(callback);
      },

      /**
       * Increases the window to the maximum available size without going full-screen.
       *
       * @link /#maximize-window
       * @param {string} [handleOrName] windowHandle URL parameter; if it is "current", the currently active window will be maximized.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.contexts
       */
      windowMaximize(handleOrName, callback) {
        return this.TransportActions.maximizeWindow(handleOrName, callback);
      },

      /**
       * Change or get the position of the specified window. If the second argument is a function it will be used as a callback and the call will perform a get request to retrieve the existing window position.
       *
       * @link /#get-window-position
       * @param {string} windowHandle
       * @param {number} offsetX
       * @param {number} offsetY
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.contexts
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
       * @link /#get-window-size
       * @param {string} windowHandle
       * @param {number} width
       * @param {number} height
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.contexts
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
       * @link /#switch-to-frame
       * @param {string|number|null} [frameId] Identifier for the frame to change focus to.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.contexts
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
       * @link /#switch-to-parent-frame
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @since v0.4.8
       * @api protocol.contexts
       */
      frameParent(callback) {
        return this.TransportActions.switchToParentFrame(callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Element related
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       * Search for an element on the page, starting from the document root. The located element will be returned as a WebElement JSON object.
       * First argument to be passed is the locator strategy, which is detailed on the [WebDriver docs](https://www.w3.org/TR/webdriver/#locator-strategies).
       *
       * ```
       * module.exports = {
       *  'demo Test' : function(browser) {
       *     browser.element('css selector', 'body', function(res) {
       *       console.log(res)
       *     });
       *   }
       *}
       * ```
       *
       * @link /#find-element
       * @syntax .element(using, value, callback)
       * @param {string} using The locator strategy to use.
       * @param {string} value The search target.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elements
       */
      element(using, value, callback) {
        let elem = Element.createFromSelector(value, using);

        return this.filterElements(elem, 'element', callback);
      },

      /**
       * Search for multiple elements on the page, starting from the document root. The located elements will be returned as WebElement JSON objects.
       * First argument to be passed is the locator strategy, which is detailed on the [WebDriver docs](https://www.w3.org/TR/webdriver/#locator-strategies).
       *
       * @link /#find-elements
       * @syntax .elements(using, value, callback)
       * @param {string|null} using The locator strategy to use.
       * @param {string} value The search target.
       * @param {function} callback Callback function to be invoked with the result when the command finishes.
       * @api protocol.elements
       */
      elements(using, value, callback) {
        let elem = Element.createFromSelector(value, using);

        return this.filterElements(elem, 'elements', callback);
      },

      /**
       * Test if two element IDs refer to the same DOM element.
       *
       * @link /#finding-elements-to-interact
       * @param {string} id ID of the element to route the command to.
       * @param {string} otherId ID of the element to compare against.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elements
       */
      elementIdEquals(id, otherId, callback) {
        return this.TransportActions.elementIdEquals(id, otherId, callback);
      },

      /**
       * Search for an element on the page, starting from the identified element. The located element will be returned as a WebElement JSON object.
       *
       * @link /#finding-elements-to-interact
       * @param {string} id ID of the element to route the command to.
       * @param {string} using The locator strategy to use.
       * @param {string} value The search target.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elements
       */
      elementIdElement(id, using, value, callback) {
        let elem = Element.createFromSelector(value, using);

        if (LocateStrategy.isValid(elem.locateStrategy)) {
          return this.TransportActions.locateSingleElementByElementId(id, elem.locateStrategy, elem.selector, callback);
        }
      },

      /**
       * Search for multiple elements on the page, starting from the identified element. The located element will be returned as a WebElement JSON objects.
       *
       * @link /#finding-elements-to-interact
       * @param {string} id ID of the element to route the command to.
       * @param {string} using The locator strategy to use.
       * @param {string} value The search target.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elements
       */
      elementIdElements(id, using, value, callback) {
        let elem = Element.createFromSelector(value, using);

        if (LocateStrategy.isValid(elem.locateStrategy)) {
          return this.Transport.locateElementFromParent(id, elem).then(callback).catch(callback);
        }
      },

      /**
       * Get the element on the page that currently has focus.
       *
       * @link /#get-active-element
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elements
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
       * @param {string} id ID of the element to route the command to.
       * @param {string} attributeName The attribute name
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementstate
       */
      elementIdAttribute(id, attributeName, callback) {
        return this.TransportActions.getElementAttribute(id, attributeName, callback);
      },

      /**
       * Retrieve the computed value of the given CSS property of the given element.
       *
       *
       * The CSS property to query should be specified using the CSS property name, not the JavaScript property name (e.g. background-color instead of backgroundColor).
       *
       * @link /#get-element-css-value
       * @param {string} id ID of the element to route the command to.
       * @param {string} cssPropertyName
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementstate
       */
      elementIdCssProperty(id, cssPropertyName, callback) {
        return this.TransportActions.getElementCSSValue(id, cssPropertyName, callback);
      },

      /**
       * Determine if an element is currently displayed.
       *
       * @link
        * @param {string} id ID of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementstate
       */
      elementIdDisplayed(id, callback) {
        return this.TransportActions.isElementDisplayed(id, callback);
      },

      /**
       * Determine if an element is currently enabled.
       *
       * @link /#is-element-enabled
       * @param {string} id ID of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementstate
       */
      elementIdEnabled(id, callback) {
        return this.TransportActions.isElementEnabled(id, callback);
      },

      /**
       * Retrieve the qualified tag name of the given element.
       *
       * @link /#get-element-tag-name
       * @param {string} id ID of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementstate
       */
      elementIdName(id, callback) {
        return this.TransportActions.getElementTagName(id, callback);
      },

      /**
       * Determine if an OPTION element, or an INPUT element of type checkbox or radio button is currently selected.
       *
       * @link /#is-element-selected
       * @param {string} id ID of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementstate
       */
      elementIdSelected(id, callback) {
        return this.TransportActions.isElementSelected(id, callback);
      },

      /**
       * Determine an element's size in pixels. The size will be returned as a JSON object with width and height properties.
       *
       * @link
       * @param {string} id ID of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementstate
       */
      elementIdSize(id, callback) {
        return this.TransportActions.getElementSize(id, callback);
      },

      /**
       * Returns the visible text for the element.
       *
       * @link /#get-element-text
       * @param {string} id ID of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementstate
       */
      elementIdText(id, callback) {
        return this.TransportActions.getElementText(id, callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Element Interaction
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       * Scrolls into view a submittable element excluding buttons or editable element, and then attempts to clear its value, reset the checked state, or text content.
       *
       * @link /#element-clear
       * @param {string} id ID of the element to route the command to.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.elementinteraction
       */
      elementIdClear(id, callback) {
        return this.TransportActions.clearElementValue(id, callback);
      },

      /**
       * Scrolls into view the element and clicks the in-view centre point. If the element is not pointer-interactable, an <code>element not interactable</code> error is returned.
       *
       * @link /#element-click
       * @param {string} id ID of the element to route the command to.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.elementinteraction
       */
      elementIdClick(id, callback) {
        return this.TransportActions.clickElement(id, callback);
      },

      /**
       * Scrolls into view the form control element and then sends the provided keys to the element, or returns the current value of the element. In case the element is not keyboard interactable, an <code>element not interactable error</code> is returned.
       *
       * @link /#element-send-keys
       * @param {string} id ID of the element to route the command to.
       * @param {string|array|none} [value] Value to send to element in case of a POST
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementinteraction
       */
      elementIdValue(id, value, callback) {
        if (arguments.length === 1 || typeof arguments.length[1] == 'function') {
          callback = arguments[1] || function () {};

          return this.TransportActions.getElementAttribute(id, 'value', callback);
        }

        return this.TransportActions.setElementValue(id, value, callback);
      },

      /**
       * Send a sequence of key strokes to the active element. The sequence is defined in the same format as the `sendKeys` command.
       * An object map with available keys and their respective UTF-8 characters, as defined on [W3C WebDriver draft spec](http://www.w3.org/TR/webdriver/#character-types), is loaded onto the main Nightwatch instance as `client.Keys`.
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

      /**
       * Submit a FORM element. The submit command may also be applied to any element that is a descendant of a FORM element.
       *
       * @link
       * @param {string} id ID of the element to route the command to.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.elementinteraction
       */
      submit(id, callback) {
        return this.TransportActions.elementSubmit(id, callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Element Location
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      /**
       * Determine an element's location on the screen once it has been scrolled into view.
       *
       * @link
       * @param {string} id ID of the element to route the command to.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.elementlocation
       */
      elementIdLocationInView(id, callback) {
        return this.TransportActions.isElementLocationInView(id, callback);
      },

      /**
       * Determine an element's location on the page. The point (0, 0) refers to the upper-left corner of the page.
       *
       * The element's coordinates are returned as a JSON object with x and y properties.
       *
       * @link
       * @param {string} id ID of the element to route the command to.
       * @param {function} callback Callback function which is called with the result value.
       * @api protocol.elementlocation
       * @returns {x:number, y:number} The X and Y coordinates for the element on the page.
       */
      elementIdLocation(id, callback) {
        return this.TransportActions.getElementLocation(id, callback);
      },

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Document Handling
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

      /**
       * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be synchronous and the result of evaluating the script is returned to the client.
       * The script argument defines the script to execute in the form of a function body. The value returned by that function will be returned to the client.
       *
       * The function will be invoked with the  provided args array and the values may be accessed via the arguments object in the order specified.
       *
       * ```
       *  this.demoTest = function (browser) {
       *    browser.execute(function(data) {
       *      // resize operation
       *      return true;
       *    }, [imagedata], function(result) {
       *      ...
       *    });
       * }
       * ```
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
       * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be asynchronous and the result of evaluating the script is returned to the client.
       *
       * Asynchronous script commands may not span page loads. If an unload event is fired while waiting for a script result, an error should be returned to the client.
       *
       * ```
       *  this.demoTest = function (browser) {
       *    browser.executeAsync(function(data, done) {
       *      someAsyncOperation(function() {
       *        done(true);
       *      });
       *    }, [imagedata], function(result) {
       *      // ...
       *    });
       * }
       * ```
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
       * Double-clicks at the current mouse coordinates (set by .moveto()).
       *
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.useractions
       */
      doubleClick(callback) {
        return this.TransportActions.doubleClick(callback);
      },

      /**
       * Click at the current mouse coordinates (set by moveto).
       *
       * The button can be (0, 1, 2) or ('left', 'middle', 'right'). It defaults to left mouse button, and if you don't pass in a button but do pass in a callback, it will handle it correctly.
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
       * Click and hold the left mouse button (at the coordinates set by the last moveto command). Note that the next mouse-related command that should follow is `mouseButtonUp` . Any other mouse command (such as click or another call to buttondown) will yield undefined behaviour.
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
       * Move the mouse by an offset of the specified element. If no element is specified, the move is relative to the current mouse cursor. If an element is provided but no offset, the mouse will be moved to the center of the element.
       *
       * If the element is not visible, it will be scrolled into view.
       *
       * @link
       * @param {string} element Opaque ID assigned to the element to move to. If not specified or is null, the offset is relative to current position of the mouse.
       * @param {number} xoffset X offset to move to, relative to the top-left corner of the element. If not specified, the mouse will move to the middle of the element.
       * @param {number} yoffset Y offset to move to, relative to the top-left corner of the element. If not specified, the mouse will move to the middle of the element.
       * @param {function} [callback] Optional callback function to be called when the command finishes.
       * @api protocol.useractions
       */
      moveTo(id, xoffset, yoffset, callback) {
        let data = {};

        if (typeof id == 'string') {
          data.element = id;
        }
        if (typeof xoffset == 'number') {
          data.xoffset = xoffset;
        }
        if (typeof yoffset == 'number') {
          data.yoffset = yoffset;
        }

        return this.TransportActions.moveTo(data, callback);
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
        return this.TransportActions.getSreenshot(log_screenshot_data, callback);
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
        return this.TransportActions.getSreenOrientation(callback);
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

        return this.TransportActions.setSreenOrientation(orientation, callback);
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
   * @param {Promise} promise
   * @param {Element} elem
   * @param {function} callback
   * @return {Promise}
   */
  filterElements(elem, commandName, callback = function () {}) {
    if (!LocateStrategy.isValid(elem.locateStrategy)) {
      let list = LocateStrategy.getList();

      throw new Error(`Provided locating strategy "${elem.locateStrategy}" is not supported. It must be one of the following: ${list}.`);
    }

    return this.findElements(elem, commandName).then(result => {
      if (this.Transport.isResultSuccess(result) && Array.isArray(result.value) && Element.requiresFiltering(elem)) {
        return this.Transport.filterElements(elem, result);
      }

      return result;
    }).catch(result => {
      Logger.error(`Error while running .${commandName}() protocol action: ${result.message || 'Unknown error.'}\n`);

      if (result instanceof Error) {
        Logger.error(result.stack);
      }

      return result;
    }).then(result => {
      callback(result);
    });
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

  findElements(elem, commandName) {
    let transportAction = commandName === 'elements' ? 'locateMultipleElements' : 'locateSingleElement';

    return this.TransportActions[transportAction](elem.locateStrategy, elem.selector, function () {});
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