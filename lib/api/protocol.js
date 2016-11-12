var elementByRecursion = require('./element-commands/_elementByRecursion.js');
var elementsByRecursion = require('./element-commands/_elementsByRecursion.js');
var Element = require('../page-object/element.js');

module.exports = function(Nightwatch) {

  var MOUSE_BUTTON_LEFT = 'left',
      MOUSE_BUTTON_MIDDLE = 'middle',
      MOUSE_BUTTON_RIGHT = 'right',
      DIRECTION_UP = 'up',
      DIRECTION_DOWN = 'down';

  var Actions = {};

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
   *  };
   * ```
   *
   * @link /#new-session
   * @syntax .session([action], [sessionId], [callback])
   * @param {string} [action] The http verb to use, can be "get", "post" or "delete". If only the callback is passed, get is assumed by default.
   * @param {string} [sessionId] The id of the session to get info about or delete.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.sessions
   */
  Actions.session  = function(action, sessionId, callback) {
    var options = {
      path : '/session'
    };

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      sessionId = Nightwatch.sessionId;
      action = 'get';
    } else {
      action = action.toLowerCase();
      if (typeof arguments[1] === 'function') {
        callback = arguments[1];
        sessionId = Nightwatch.sessionId;
      }
    }

    switch (action) {
      case 'delete':
        options.method = 'DELETE';
        break;
      case 'post':
        options.method = 'POST';
        break;
      case 'get':
        options.method = 'GET';
        break;
      default:
        sessionId = arguments[0];
        action = 'get';
        options.method = 'GET';
    }

    if (action != 'post') {
      options.path += '/' + sessionId;
    }

    return sendRequest(options, callback);
  };

  /**
   * Returns a list of the currently active sessions.
   *
   * ```
   *  this.demoTest = function (browser) {
   *    browser.sessions(function(result) {
   *      console.log(result.value);
   *    });
   *  };
   * ```
   *
   * @section sessions
   * @syntax .sessions(callback)
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.sessions
   */
  Actions.sessions  = function(callback) {
    var options = {
      path : '/sessions',
      method : 'GET'
    };
    return sendRequest(options, callback);
  };

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
  Actions.timeouts  = function(type, ms, callback) {
    var timeoutValues = ['script', 'implicit', 'page load'];
    if (timeoutValues.indexOf(type) === -1) {
      throw new Error('Invalid timeouts type value: ' + type + '. Possible values are: ' + timeoutValues.join(','));
    }
    if (typeof ms != 'number') {
      throw new Error('Second argument must be number.');
    }
    return postRequest('/timeouts', {
      type : type,
      ms : ms
    }, callback);
  };

  /**
   * Set the amount of time, in milliseconds, that asynchronous scripts executed by `.executeAsync` are permitted to run before they are aborted and a |Timeout| error is returned to the client.
   *
   * @syntax .timeoutsAsyncScript(ms, [callback])
   * @param {number} ms The amount of time, in milliseconds, that time-limited commands are permitted to run.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.sessions
   */
  Actions.timeoutsAsyncScript  = function(ms, callback) {
    if (typeof ms != 'number') {
      throw new Error('First argument must be number.');
    }
    return postRequest('/timeouts/async_script', {
      ms : ms
    }, callback);
  };

  /**
   * Set the amount of time the driver should wait when searching for elements. If this command is never sent, the driver will default to an implicit wait of 0ms.
   *
   * @link
   * @syntax .timeoutsImplicitWait(ms, [callback])
   * @param {number} ms The amount of time, in milliseconds, that time-limited commands are permitted to run.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.sessions
   */
  Actions.timeoutsImplicitWait  = function(ms, callback) {
    if (typeof ms != 'number') {
      throw new Error('First argument must be number.');
    }
    return postRequest('/timeouts/implicit_wait', {
      ms : ms
    }, callback);
  };

  /**
   * Query the server's current status.
   *
   * @link /status
   * @syntax .status([callback])
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.sessions
   */
  Actions.status = function(callback) {
    return sendRequest({
      method : 'GET',
      path   : '/status'
    }, callback);
  };

  /**
   * Gets the text of the log type specified. To find out the available log types, use `.getLogTypes()`.
   *
   * @syntax .sessionLog(typeString, callback)
   * @param {string} typeString Type of log to request.
   * @param {function} callback Callback function which is called with the result value.
   * @returns {Array} Array of the text entries of the log.
   * @api protocol.sessions
   */
  Actions.sessionLog = function(typeString, callback) {
    return postRequest('/log', {type: typeString}, callback);
  };

  /**
   * Gets an array of strings for which log types are available. This methods returns the entire WebDriver response, if you are only interested in the logs array, use `.getLogTypes()` instead.
   *
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.sessions
   */
  Actions.sessionLogTypes = function(callback) {
    return getRequest('/log/types', callback);
  };

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
   * };
   * ```
   *
   * @link /#go
   * @syntax .url([url], [callback])
   * @syntax .url(callback)
   * @param {string|function} [url] If missing, it will return the URL of the current page as an argument to the supplied callback.
   * @param {Function} [callback]
   * @api protocol.navigation
   */
  Actions.url = function(url, callback) {
    if (typeof url == 'string') {
      return postRequest('/url', {
        url : url
      }, callback);
    }

    if (typeof url == 'function') {
      callback = url;
    }

    return getRequest('/url', callback);
  };

  /**
   * Navigate backwards in the browser history, if possible.
   *
   * @link /#back
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.navigation
   */
  Actions.back = function(callback) {
    return postRequest('/back', callback);
  };

  /**
   * Navigate forwards in the browser history, if possible.
   *
   * @link /#forward
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.navigation
   */
  Actions.forward = function(callback) {
    return postRequest('/forward', callback);
  };

  /**
   * Refresh the current page.
   *
   * @link /#refresh
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.navigation
   */
  Actions.refresh = function(callback) {
    return postRequest('/refresh', callback);
  };

  /**
   * Get the current page title.
   *
   * @link /#get-title
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.navigation
   */
  Actions.title = function(callback) {
    return getRequest('/title', callback);
  };

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
  Actions.window = function(method, handleOrName, callback) {
    method = method.toUpperCase();

    switch (method) {
      case 'POST':
        if (arguments.length < 2) {
          throw new Error('POST requests to /window must include a name parameter also.');
        }

        return postRequest('/window', {
          name : handleOrName
        }, callback);

      case 'DELETE':
        return deleteRequest('/window', arguments[1]);
      default:
        throw new Error('This method expects first argument to be either POST or DELETE.');
    }
  };

  /**
   * Retrieve the current window handle.
   *
   * @link /#get-window-handle
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.contexts
   */
  Actions.windowHandle =  function(callback) {
    return getRequest('/window_handle', callback);
  };

  /**
   * Retrieve the list of all window handles available to the session.
   *
   * @link /#get-window-handles
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.contexts
   */
  Actions.windowHandles = function(callback) {
    return getRequest('/window_handles', callback);
  };

  /**
   * Increases the window to the maximum available size without going full-screen.
   *
   * @link /#maximize-window
   * @param {string} [handleOrName] windowHandle URL parameter; if it is "current", the currently active window will be maximized.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.contexts
   */
  Actions.windowMaximize = function(handleOrName, callback) {
    return postRequest('/window/'+ handleOrName + '/maximize', callback);
  };

  /*!
   * @deprecated
   */
  Actions.window_handle = Actions.windowHandle;

  /*!
   * @deprecated
   */
  Actions.window_handles = Actions.windowHandles;

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
  Actions.windowPosition = function(windowHandle, offsetX, offsetY, callback) {
    if (typeof windowHandle !== 'string') {
      throw new Error('First argument must be a window handle string.');
    }

    var path = '/window/' + windowHandle + '/position';
    if (arguments.length === 2 && typeof arguments[1] === 'function') {
      return getRequest(path, arguments[1]);
    }

    offsetX = Number(offsetX);
    offsetY = Number(offsetY);

    if (typeof offsetX !== 'number' || isNaN(offsetX)) {
      throw new Error('Offset arguments must be passed as numbers.');
    }

    if (typeof offsetY !== 'number' || isNaN(offsetY)) {
      throw new Error('Offset arguments must be passed as numbers.');
    }

    return postRequest(path, {
      x : offsetX,
      y : offsetY
    }, callback);
  };

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
  Actions.windowSize = function(windowHandle, width, height, callback) {
    if (typeof windowHandle !== 'string') {
      throw new Error('First argument must be a window handle string.');
    }

    var path = '/window/' + windowHandle + '/size';
    if (arguments.length === 2 && typeof arguments[1] === 'function') {
      return getRequest(path, arguments[1]);
    }

    width = Number(width);
    height = Number(height);

    if (typeof width !== 'number' || isNaN(width)) {
      throw new Error('Width and height arguments must be passed as numbers.');
    }

    if (typeof height !== 'number' || isNaN(height)) {
      throw new Error('Width and height arguments must be passed as numbers.');
    }

    return postRequest(path, {
      width : width,
      height : height
    }, callback);
  };

  /**
   * Change focus to another frame on the page. If the frame id is missing or null, the server should switch to the page's default content.
   *
   * @link /#switch-to-frame
   * @param {string|number|null} [frameId] Identifier for the frame to change focus to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.contexts
   */
  Actions.frame = function(frameId, callback) {
    if (arguments.length === 1 && typeof frameId === 'function') {
      callback = frameId;
      return postRequest('/frame', callback);
    }

    return postRequest('/frame', {
      id: frameId
    }, callback);
  };

  /**
   * Change focus to the parent context. If the current context is the top level browsing context, the context remains unchanged.
   *
   * @link /#switch-to-parent-frame
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @since v0.4.8
   * @api protocol.contexts
   */
  Actions.frameParent = function(callback) {
    return postRequest('/frame/parent', callback);
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Element related
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*!
   * element protocol action
   *
   * @param {string} using
   * @param {string} value
   * @param {function} callback
   * @private
   */
  function element(elem, callback) {
    validateStrategy(elem.locateStrategy);

    return postRequest('/element', {
      using: elem.locateStrategy,
      value: elem.selector
    }, callback);
  }

  /*!
   * elements protocol action
   *
   * @param {string} using
   * @param {string} value
   * @param {function} callback
   * @private
   */
  function elements(elem, callback) {
    validateStrategy(elem.locateStrategy);

    return postRequest('/elements', {
        using: elem.locateStrategy,
        value: elem.selector
      }, filterElementsForCallback(elem, callback)
    );
  }

  function validateStrategy(using) {

    var usingLow = String(using).toLocaleLowerCase();
    var strategies = ['class name', 'css selector', 'id', 'name', 'link text',
      'partial link text', 'tag name', 'xpath'];

    if (strategies.indexOf(usingLow) === -1) {
      throw new Error('Provided locating strategy is not supported: ' +
        using + '. It must be one of the following:\n' +
        strategies.join(', '));
    }
  }

  /**
   * Wraps an elements protocol request callback to include logic to select
   * a subset of elements if that request requires filtering.
   *
   * @param {Object} elem
   * @param {function} callback
   * @private
   */
  function filterElementsForCallback(elem, callback) {
    if (!Element.requiresFiltering(elem)) {
      return callback;
    }

    return callback && function elementsCallbackWrapper(result) {
        if (result && result.status === 0) {

          var filtered = Element.applyFiltering(elem, result.value);
          if (filtered) {

            result.value = filtered;

          } else {

            result.status = -1;
            result.value = [];
            var errorId = 'NoSuchElement';
            var errorInfo = findErrorById(errorId);
            if (errorInfo) {
              result.message = errorInfo.message;
              result.errorStatus = errorInfo.status;
            }
          }
        }

        return callback(result);
      };
  }

  /**
   * Looks up error status info from an id string rather than id number.
   *
   * @param {string} id String id to look up an error with.
   */
  function findErrorById(id) {
    var errorCodes = require('./errors.json');
    for (var status in errorCodes) {
      if (errorCodes[status].id === id) {
        return {
          status: status,
          id: id,
          message: errorCodes[status].message
        };
      }
    }

    return null;
  }

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
   * };
   * ```
   *
   * @link /#find-element
   * @syntax .element(using, value, callback)
   * @param {string} using The locator strategy to use.
   * @param {string} value The search target.
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.elements
   */
  Actions.element = function(using, value, callback) {
    var elem = Element.fromSelector(value, using);
    if (elem.locateStrategy == 'recursion') {
      return new elementByRecursion(Nightwatch).command(elem.selector, callback);
    }

    return element(elem, callback);
  };

  /**
   * Search for multiple elements on the page, starting from the document root. The located elements will be returned as WebElement JSON objects.
   * First argument to be passed is the locator strategy, which is detailed on the [WebDriver docs](https://www.w3.org/TR/webdriver/#locator-strategies).
   *
   * @link /#find-elements
   * @syntax .elements(using, value, callback)
   * @param {string} using The locator strategy to use.
   * @param {string} value The search target.
   * @param {function} callback Callback function to be invoked with the result when the command finishes.
   * @api protocol.elements
   */
  Actions.elements = function(using, value, callback) {
    var elem = Element.fromSelector(value, using);
    if (elem.locateStrategy == 'recursion') {
      return new elementsByRecursion(Nightwatch).command(elem.selector, callback);
    }

    return elements(elem, callback);
  };

  /**
   * Test if two element IDs refer to the same DOM element.
   *
   * @link /#finding-elements-to-interact
   * @param {string} id ID of the element to route the command to.
   * @param {string} otherId ID of the element to compare against.
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.elements
   */
  Actions.elementIdEquals = function(id, otherId, callback) {
    return getRequest('/element/' + id + '/equals/' + otherId, callback);
  };

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
  Actions.elementIdElement = function(id, using, value, callback) {
    var elem = Element.fromSelector(value, using);
    validateStrategy(elem.locateStrategy);

    return postRequest('/element/' + id + '/element', {
      using: elem.locateStrategy,
      value: elem.selector
    }, callback);
  };

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
  Actions.elementIdElements = function(id, using, value, callback) {
    var elem = Element.fromSelector(value, using);
    validateStrategy(elem.locateStrategy);

    return postRequest('/element/' + id + '/elements', {
        using: elem.locateStrategy,
        value: elem.selector
      }, filterElementsForCallback(elem, callback)
    );
  };

  /**
   * Get the element on the page that currently has focus.
   *
   * @link /#get-active-element
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.elements
   */
  Actions.elementActive = function(callback) {
    return postRequest('/element/active', {}, callback);
  };

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
  Actions.elementIdAttribute = function(id, attributeName, callback) {
    return getRequest('/element/' + id + '/attribute/' + attributeName, callback);
  };

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
  Actions.elementIdCssProperty = function(id, cssPropertyName, callback) {
    return getRequest('/element/' + id + '/css/' + cssPropertyName, callback);
  };

  /**
   * Determine if an element is currently displayed.
   *
   * @link
   * @param {string} id ID of the element to route the command to.
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.elementstate
   */
  Actions.elementIdDisplayed = function(id, callback) {
    return getRequest('/element/' + id + '/displayed', callback);
  };

  /**
   * Determine if an element is currently enabled.
   *
   * @link /#is-element-enabled
   * @param {string} id ID of the element to route the command to.
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.elementstate
   */
  Actions.elementIdEnabled = function(id, callback) {
    return getRequest('/element/' + id + '/enabled', callback);
  };

  /**
   * Retrieve the qualified tag name of the given element.
   *
   * @link /#get-element-tag-name
   * @param {string} id ID of the element to route the command to.
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.elementstate
   */
  Actions.elementIdName = function(id, callback) {
    return getRequest('/element/' + id + '/name', callback);
  };

  /**
   * Determine if an OPTION element, or an INPUT element of type checkbox or radio button is currently selected.
   *
   * @link /#is-element-selected
   * @param {string} id ID of the element to route the command to.
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.elementstate
   */
  Actions.elementIdSelected = function(id, callback) {
    return getRequest('/element/' + id + '/selected', callback);
  };

  /**
   * Determine an element's size in pixels. The size will be returned as a JSON object with width and height properties.
   *
   * @link
   * @param {string} id ID of the element to route the command to.
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.elementstate
   */
  Actions.elementIdSize = function(id, callback) {
    return getRequest('/element/' + id + '/size', callback);
  };

  /**
   * Returns the visible text for the element.
   *
   * @link /#get-element-text
   * @param {string} id ID of the element to route the command to.
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.elementstate
   */
  Actions.elementIdText = function(id, callback) {
    return getRequest('/element/' + id + '/text', callback);
  };

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
  Actions.elementIdClear = function(id, callback) {
    return postRequest('/element/' + id + '/clear', callback);
  };

  /**
   * Scrolls into view the element and clicks the in-view centre point. If the element is not pointer-interactable, an <code>element not interactable</code> error is returned.
   *
   * @link /#element-click
   * @param {string} id ID of the element to route the command to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.elementinteraction
   */
  Actions.elementIdClick = function(id, callback) {
    return postRequest('/element/' + id + '/click', '', callback);
  };

  /**
   * Scrolls into view the form control element and then sends the provided keys to the element, or returns the current value of the element. In case the element is not keyboard interactable, an <code>element not interactable error</code> is returned.
   *
   * @link /#element-send-keys
   * @param {string} id ID of the element to route the command to.
   * @param {string|array|none} [value] Value to send to element in case of a POST
   * @param {function} callback Callback function which is called with the result value.
   * @api protocol.elementinteraction
   */
  Actions.elementIdValue = function(id, value, callback) {
    if (arguments.length === 2 && typeof arguments[1] === 'function') {
      callback = arguments[1];
      return getRequest('/element/' + id + '/attribute/value', callback);
    }

    if (Array.isArray(value)) {
      value = value.join('');
    } else {
      value = String(value);
    }

    return postRequest('/element/' + id + '/value', {
      value: value.split('')
    }, callback);
  };

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
  Actions.keys = function(keysToSend, callback) {
    if (!Array.isArray(keysToSend)) {
      keysToSend = [keysToSend];
    }
    return postRequest('/keys', {
      value: keysToSend
    }, callback);
  };

  /**
   * Submit a FORM element. The submit command may also be applied to any element that is a descendant of a FORM element.
   *
   * @link
   * @param {string} id ID of the element to route the command to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.elementinteraction
   */
  Actions.submit = function(id, callback) {
    return postRequest('/element/' + id + '/submit', '', callback);
  };

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
  Actions.elementIdLocationInView = function(id, callback) {
    return getRequest('/element/' + id + '/location_in_view', callback);
  };

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
  Actions.elementIdLocation = function(id, callback) {
    return getRequest('/element/' + id + '/location', callback);
  };

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
  Actions.source = function(callback) {
    return getRequest('/source', callback);
  };


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
   *  };
   * ```
   *
   * @link /#executing-script
   * @param {string|function} body The function body to be injected.
   * @param {Array} args An array of arguments which will be passed to the function.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.document
   * @returns {*} The script result.
   */
  Actions.execute = function(body, args, callback) {
    var executeArgs = Array.prototype.slice.call(arguments, 0);
    executeArgs.unshift('/execute');

    return executeHandler.apply(null, executeArgs);
  };

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
   *  };
   * ```
   *
   * @link /#execute-async-script
   * @param {string|function} script The function body to be injected.
   * @param {Array} args An array of arguments which will be passed to the function.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.document
   * @returns {*} The script result.
   */
  Actions.executeAsync = function(script, args, callback) {
    args = Array.prototype.slice.call(arguments, 0);
    args.unshift('/execute_async');

    return executeHandler.apply(null, args);
  };

  /*!
   * @deprecated
   */
  Actions.execute_async = Actions.executeAsync;

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
  Actions.cookie = function(method, callbackOrCookie) {
    switch (method) {
      case 'GET':
        return getRequest('/cookie', callbackOrCookie);
      case 'POST':
        if (arguments.length < 2) {
          throw new Error('POST requests to /cookie must include a cookie object parameter also.');
        }
        return postRequest('/cookie', {
          cookie : callbackOrCookie
        }, arguments[2]);
      case 'DELETE':
        if (typeof callbackOrCookie === 'undefined' || typeof callbackOrCookie === 'function') {
          return deleteRequest('/cookie', callbackOrCookie);
        }
        return deleteRequest('/cookie/' + callbackOrCookie, arguments[2]);
      default:
        throw new Error('This method expects first argument to be either GET, POST or DELETE.');
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // User Actions
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * Double-clicks at the current mouse coordinates (set by .moveto()).
   *
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.useractions
   */
  Actions.doubleClick = function(callback) {
    return postRequest('/doubleclick', callback);
  };

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
  Actions.mouseButtonClick = function(button, callback) {
    var buttonIndex;
    if (arguments.length === 0) {
      button = 0;
    } else {
      if (typeof(button) === 'function') {
        callback = button;
        button = 0;
      }

      if (typeof button === 'string') {
        buttonIndex = [
          MOUSE_BUTTON_LEFT,
          MOUSE_BUTTON_MIDDLE,
          MOUSE_BUTTON_RIGHT
        ].indexOf(button.toLowerCase());

        if (buttonIndex !== -1) {
          button = buttonIndex;
        }
      }
    }

    return postRequest('/click', {button: button}, callback);
  };

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
  Actions.mouseButtonDown = function(button, callback) {
    return mouseButtonHandler(DIRECTION_DOWN, button, callback);
  };

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
  Actions.mouseButtonUp = function(button, callback) {
    return mouseButtonHandler(DIRECTION_UP, button, callback);
  };

  /**
   * Move the mouse by an offset of the specificed element. If no element is specified, the move is relative to the current mouse cursor. If an element is provided but no offset, the mouse will be moved to the center of the element.
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
  Actions.moveTo = function(element, xoffset, yoffset, callback) {
    var data = {};
    if (typeof element == 'string') {
      data.element = element;
    }
    if (typeof xoffset == 'number') {
      data.xoffset = xoffset;
    }
    if (typeof yoffset == 'number') {
      data.yoffset = yoffset;
    }
    return postRequest('/moveto', data, callback);
  };

  /*!
   * Helper function for mouseButton actions
   *
   * @param {string} direction
   * @param {string|number} button
   * @param {function} callback
   * @private
   */
  function mouseButtonHandler(direction, button, callback) {
    var buttonIndex;
    if (typeof(button) === 'function') {
      callback = button;
      button = 0;
    }

    if (typeof button === 'string') {
      buttonIndex = [
        MOUSE_BUTTON_LEFT,
        MOUSE_BUTTON_MIDDLE,
        MOUSE_BUTTON_RIGHT
      ].indexOf(button.toLowerCase());

      if (buttonIndex !== -1) {
        button = buttonIndex;
      }
    }

    return postRequest('/button' + direction, {button: button}, callback);
  }

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
  Actions.acceptAlert = function(callback) {
    return postRequest('/accept_alert', callback);
  };

  /*!
   * @deprecated
   */
  Actions.accept_alert = Actions.acceptAlert;

  /**
   * Dismisses the currently displayed alert dialog. For confirm() and prompt() dialogs, this is equivalent to clicking the 'Cancel' button.
   *
   * For alert() dialogs, this is equivalent to clicking the 'OK' button.
   *
   * @link /#dismiss-alert
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.userprompts
   */
  Actions.dismissAlert = function(callback) {
    return postRequest('/dismiss_alert', callback);
  };

  /**
   * Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.
   *
   * @link /#get-alert-text
   * @param {function} callback Callback function which is called with the result value.
   * @returns {string} The text of the currently displayed alert.
   * @api protocol.userprompts
   */
  Actions.getAlertText = function(callback) {
    return getRequest('/alert_text', callback);
  };

  /**
   * Sends keystrokes to a JavaScript prompt() dialog.
   *
   * @link /#send-alert-text
   * @param {string} value Keystrokes to send to the prompt() dialog
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.userprompts
   */
  Actions.setAlertText = function(value, callback) {
    return postRequest('/alert_text', {text: value}, callback);
  };


  /*!
   * @deprecated
   */
  Actions.dismiss_alert = Actions.dismissAlert;

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
  Actions.screenshot = function(log_screenshot_data, callback) {
    return getRequest('/screenshot', callback).on('beforeResult', function(result) {
      result = result || {};
      if (!log_screenshot_data) {
        result.suppressBase64Data = true;
      }
    });
  };

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
  Actions.getOrientation  = function(callback) {
    return getRequest('/orientation', callback);
  };

  /**
   * Sets the browser orientation.
   *
   * @param {string} orientation The new browser orientation: {LANDSCAPE|PORTRAIT}
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.mobile
   */
  Actions.setOrientation = function (orientation, callback) {
    orientation = orientation.toUpperCase();
    var accepted = ['LANDSCAPE', 'PORTRAIT'];
    if (accepted.indexOf(orientation) == -1) {
      throw new Error('Invalid orientation value specified. Accepted values are: ' + accepted.join(', '));
    }

    return postRequest('/orientation', {
      orientation : orientation
    }, callback);
  };

  /**
   * Get a list of the available contexts.
   *
   * Used by Appium when testing hybrid mobile web apps. More info here: https://github.com/appium/appium/blob/master/docs/en/advanced-concepts/hybrid.md.
   *
   * @param {function} callback Callback function to be called when the command finishes.
   * @returns {Array} an array of strings representing available contexts, e.g 'WEBVIEW', or 'NATIVE'
   * @api protocol.mobile
   */
  Actions.contexts = function(callback) {
    return getRequest('/contexts', callback);
  };

 /**
  *
  * Get current context.
  *
  * @param {function} callback Callback function to be called when the command finishes.
  * @returns {string|null} a string representing the current context or `null`, representing "no context"
  * @api protocol.mobile
  */
  Actions.currentContext = function(callback) {
    return getRequest('/context', callback);
  };

  /**
   * Sets the context.
   *
   * @param {string} context context name to switch to - a string representing an available context.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol.mobile
   */
  Actions.setContext = function (context, callback) {
    var data = {
      name: context
    };
    return postRequest('/context', data, callback);
  };


  /////////////////////////////////////////////////////////////////////////////
  // Window specific commands
  /////////////////////////////////////////////////////////////////////////////
  /*!
   * Helper function for execute and execute_async
   *
   * @param {string} path
   * @param {string|function} script
   * @param {Array} args
   * @param {function} callback
   * @private
   */
  function executeHandler(path, script, args, callback) {
    var fn;

    if (typeof script === 'function') {
      fn = 'var passedArgs = Array.prototype.slice.call(arguments,0); return ' +
        script.toString() + '.apply(window, passedArgs);';
    } else {
      fn = script;
    }

    if (arguments.length === 2) {
      args = [];
    } else if ((arguments.length === 3) && (typeof arguments[2] === 'function')) {
      callback = arguments[2];
      args = [];
    }

    return postRequest(path, {
      script: fn,
      args: args
    }, callback);
  }


  /////////////////////////////////////////////////////////////////////////////
  // Helpers
  /////////////////////////////////////////////////////////////////////////////
  function getRequest(path, callback) {
    var options = {
      path : '/session/' + Nightwatch.sessionId + path,
      method : 'GET'
    };
    return sendRequest(options, callback);
  }

  function deleteRequest(path, callback) {
    var options = {
      path : '/session/' + Nightwatch.sessionId + path,
      method : 'DELETE'
    };
    return sendRequest(options, callback);
  }

  function postRequest(path, data, callback) {
    if (arguments.length === 2 && typeof data === 'function') {
      callback = data;
      data = '';
    }
    var options = {
      path : '/session/' + Nightwatch.sessionId + path,
      method : 'POST',
      data : data || ''
    };
    return sendRequest(options, callback);
  }

  function sendRequest(options, callback) {
    callback = callback || function() {};
    return Nightwatch.runProtocolAction(options, callback).send();
  }

  return Actions;
};
