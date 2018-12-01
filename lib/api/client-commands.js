const Screenshots = require('../testsuite/screenshots.js');

module.exports = function(client) {
  const noopFn = function() {};

  let Commands = {
    /**
     * Change focus to another window. The window to change focus to may be specified by its server assigned window handle, or by the value of its name attribute.
     *
     * To find out the window handle use `windowHandles` command
     *
     * @example
     *  this.demoTest = function (browser) {
     *    browser.windowHandles(function(result) {
     *      var handle = result.value[0];
     *      browser.switchWindow(handle);
     *    });
     *  };
     *
     *
     * @method switchWindow
     * @param {string} handleOrName The server assigned window handle or the name attribute.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see window
     * @api protocol.contexts
     */
    switchWindow: ['window', 'POST'],

    /**
     * Resizes the current window.
     *
     * @example
     *  this.demoTest = function (browser) {
     *    browser.resizeWindow(1000, 800);
     *  };
     *
     *
     * @method resizeWindow
     * @param {number} width The new window width.
     * @param {number} height The new window height.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see windowSize
     * @api protocol.contexts
     */
    resizeWindow: ['windowSize', 'current'],

    /**
     * Sets the current window position.
     *
     * @example
     *  this.demoTest = function (browser) {
     *    browser.setWindowPosition(0, 0);
     *  };
     *
     *
     * @method setWindowPosition
     * @param {number} offsetX The new window offset x-position.
     * @param {number} offsetY The new window offset y-position.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see windowPosition
     * @api protocol.contexts
     */
    setWindowPosition: ['windowPosition', 'current'],

    /**
     * Maximizes the current window.
     *
     * @example
     *  this.demoTest = function (browser) {
     *    browser.maximizeWindow();
     *  };
     *
     *
     * @method maximizeWindow
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see windowMaximize
     * @api protocol.contexts
     */
    maximizeWindow: ['windowMaximize', 'current'],

    /**
     * Take a screenshot of the current page and saves it as the given filename.
     *
     * @example
     *  this.demoTest = function (browser) {
     *    browser.saveScreenshot('/path/to/fileName.png');
     *  };
     *
     *
     * @method saveScreenshot
     * @param {string} fileName The complete path to the file name where the screenshot should be saved.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see screenshot
     * @api protocol.screens
     */
    saveScreenshot(fileName, callback = noopFn) {
      return this.screenshot(client.options.log_screenshot_data, result => {
        return new Promise((resolve, reject) => {
          Screenshots.writeScreenshotToFile(fileName, result.value, err => {
            const cbResult = callback.call(this, result, err);
            if (cbResult instanceof Promise) {
              cbResult.then(_ => resolve(result)).catch(ex => reject(ex));
            } else {
              resolve(result);
            }
          });
        });
      });
    },

    /**
     * Returns the title of the current page. Uses title protocol command.
     *
     * @example
     *  this.demoTest = function (browser) {
     *    browser.getTitle(function(title) {
     *      this.assert.equal(typeof title, 'string');
     *      this.assert.equal(title, 'Nightwatch.js');
     *    });
     *  };
     *
     *
     * @method getTitle
     * @syntax .getTitle(callback)
     * @param {function} callback Callback function which is called with the result value.
     * @see title
     * @returns {string} The page title.
     * @api protocol.navigation
     */
    getTitle(callback = noopFn) {
      return this.title(result => {
        callback.call(this, result.value);
      });
    },

    /**
     * Close the current window. This can be useful when you're working with multiple windows open (e.g. an OAuth login).
     * Uses `window` protocol command.
     *
     * @example
     * this.demoTest = function (client) {
     *   client.closeWindow();
     * };
     *
     *
     * @method closeWindow
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see window
     * @api protocol.contexts
     */
    closeWindow: ['window', 'DELETE'],

    /**
     * This command is an alias to url and also a convenience method when called without any arguments in the sense that it performs a call to .url() with passing the value of `launch_url` field from the settings file.
     * Uses `url` protocol command.
     *
     * @example
     * this.demoTest = function (client) {
     *   client.init();
     * };
     *
     *
     * @method init
     * @param {string} [url] Url to navigate to.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see url
     * @api protocol.navigation
     */
    init(url, callback) {
      if (typeof url == 'string') {
        return this.url(url, callback);
      }

      if (!this.launchUrl) {
        return this;
      }

      if (typeof arguments[0] == 'function') {
        callback = arguments[0];
      }

      return this.url(this.launchUrl, callback);
    },

    /**
     * Convenience method that adds the specified hash (i.e. url fragment) to the current value of the `launch_url` as set in `nightwatch.json`.
     *
     * @example
     * this.demoTest = function (client) {
     *   client.urlHash('#hashvalue');
     *   // or
     *   client.urlHash('hashvalue');
     * };
     *
     *
     * @method urlHash
     * @param {string} hash The hash to add/replace to the current url (i.e. the value set in the launch_url property in nightwatch.json).
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see url
     * @api protocol.navigation
     */
    urlHash(hash, callback) {
      if (hash.charAt(0) === '#') {
        hash = hash.substring(1);
      }

      return this.url(this.launchUrl + '#' + hash, callback);
    },

    /**
     * Retrieve all cookies visible to the current page. The cookies are returned as an array of cookie JSON object, as defined [here](https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object).
     *
     * Uses `cookie` protocol command.
     *
     * @example
     * this.demoTest = function(browser) {
     *   browser.getCookies(function callback(result) {
     *     this.assert.equal(result.value.length, 1);
     *     this.assert.equals(result.value[0].name, 'test_cookie');
     *   });
     * }
     *
     *
     * @method getCookies
     * @param {function} callback The callback function which will receive the response as an argument.
     * @syntax .getCookies(callback)
     * @api protocol.cookies
     * @see cookie
     * @returns {Array.<object>} A list of cookies.
     */
    getCookies: ['cookie', 'GET'],

    /**
     * Retrieve a single cookie visible to the current page. The cookie is returned as a cookie JSON object, as defined [here](https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object).
     *
     * Uses `cookie` protocol command.
     *
     * @example
     * this.demoTest = function(browser) {
     *   browser.getCookie(name, function callback(result) {
     *     this.assert.equal(result.value, '123456');
     *     this.assert.equals(result.name, 'test_cookie');
     *   });
     * }
     *
     *
     * @method getCookie
     * @param {string} name The cookie name.
     * @param {function} callback Callback function which is called with the result value.
     * @api protocol.cookies
     * @syntax .getCookie(name, callback)
     * @see cookie
     * @returns {object|null} The cookie object as a selenium cookie JSON object or null if the cookie wasn't found.
     */
    getCookie(name, callback = noopFn) {
      return this.cookie('GET', result => {
        if (!result.value || result.value.length === 0) {
          callback.call(this, null);

          return;
        }

        let cookie = null;
        for (let i = 0; i < result.value.length; i++) {
          if (result.value[i].name === name) {
            cookie = result.value[i];
            break;
          }
        }

        callback.call(this, cookie);
      });
    },

    /**
     * Set a cookie, specified as a cookie JSON object, as defined [here](https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object).
     *
     * Uses `cookie` protocol command.
     *
     * @example
     * this.demoTest = function(browser) {
     *   browser.setCookie({
     *     name     : "test_cookie",
     *     value    : "test_value",
     *     path     : "/", (Optional)
     *     domain   : "example.org", (Optional)
     *     secure   : false, (Optional)
     *     httpOnly : false, // (Optional)
     *     expiry   : 1395002765 // (Optional) time in seconds since midnight, January 1, 1970 UTC
     *   });
     * }
     *
     *
     * @method setCookie
     * @param {object} cookie The cookie object.
     * @syntax .setCookie(cookie, [callback])
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @api protocol.cookies
     * @see cookie
     */
    setCookie: ['cookie', 'POST'],

    /**
     * Delete the cookie with the given name. This command is a no-op if there is no such cookie visible to the current page.
     *
     * @example
     * this.demoTest = function(browser) {
     *   browser.deleteCookie("test_cookie", function() {
     *     // do something more in here
     *   });
     * }
     *
     *
     * @method deleteCookie
     * @syntax .deleteCookie(cookieName, [callback])
     * @param {string} cookieName The name of the cookie to delete.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @api protocol.cookies
     * @see cookie
     */
    deleteCookie: ['cookie', 'DELETE'],

    /**
     * Delete all cookies visible to the current page.
     *
     * @example
     * this.demoTest = function(browser) {
     *   browser.deleteCookies(function() {
     *     // do something more in here
     *   });
     * }
     *
     *
     * @method deleteCookies
     * @syntax .deleteCookies([callback])
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @api protocol.cookies
     * @see cookie
     */
    deleteCookies: ['cookie', 'DELETE'],

    /**
     * Utility command to load an external script into the page specified by url.
     *
     * @example
     * this.demoTest = function(client) {
     *   this.injectScript("{script-url}", function() {
     *     // we're all done here.
     *   });
     * };
     *
     *
     * @method injectScript
     * @param {string} scriptUrl The script file url
     * @param {string} [id] Dom element id to be set on the script tag.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @api protocol.document
     * @returns {HTMLScriptElement} The newly created script tag.
     */
    injectScript(scriptUrl, id, callback = noopFn) {
      let args = [scriptUrl];
      if (arguments.length === 2 && typeof arguments[1] == 'function') {
        callback = arguments[1];
      } else if (typeof id == 'string') {
        args.push(id);
      }

      // eslint-disable-next-line no-undef
      return this.execute(function(u,i) {/* jshint browser:true */return (function(d){var e=d.createElement('script');var m=d.getElementsByTagName('head')[0];e.src=u;if(i){e.id=i;}m.appendChild(e);return e;})(document);}, args, callback);
    },

    /**
     * Gets the available log types. More info about log types in WebDriver can be found here: https://github.com/SeleniumHQ/selenium/wiki/Logging
     *
     * @example
     * this.demoTest = function(client) {
     *   this.getLogTypes(function(typesArray) {
     *     console.log(typesArray);
     *   });
     * };
     *
     *
     * @method getLogTypes
     * @syntax .getLogTypes(callback)
     * @param {function} callback Callback function which is called with the result value.
     * @returns {Array} Available log types
     * @api protocol.sessions
     * @see sessionLogTypes
     */
    getLogTypes(callback = noopFn) {
      return this.sessionLogTypes(result => {
        callback.call(this, result.value);
      });
    },

    /**
     * Gets a log from selenium.
     *
     * @example
     * this.demoTest = function(client) {
     *   this.getLog('browser', function(logEntriesArray) {
     *     console.log('Log length: ' + logEntriesArray.length);
     *     logEntriesArray.forEach(function(log) {
     *        console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
     *      });
     *   });
     * };
     *
     *
     * @method getLog
     * @syntax .getLog([typeString], callback)
     * @param {string|function} typeString Log type to request
     * @param {function} callback Callback function which is called with the result value.
     * @api protocol.sessions
     * @see getLogTypes
     */
    getLog(typeString, callback) {
      if (arguments.length === 1 && typeof arguments[0] == 'function') {
        callback = arguments[0];
        typeString = 'browser';
      }

      return this.sessionLog(typeString, result => {
        callback.call(this, result.value);
      });
    },

    /**
     * Utility command to test if the log type is available.
     *
     * @example
     * this.demoTest = function(browser) {
     *   browser.isLogAvailable('browser', function(isAvailable) {
     *     // do something more in here
     *   });
     * }
     *
     *
     * @method isLogAvailable
     * @syntax .isLogAvailable([typeString], callback)
     * @param {string|function} typeString Type of log to test
     * @param {function} callback Callback function which is called with the result value.
     * @api protocol.sessions
     * @see getLogTypes
     */
    isLogAvailable(typeString, callback = noopFn) {
      if (arguments.length === 1 && typeof arguments[0] == 'function') {
        callback = arguments[0];
        typeString = 'browser';
      }

      return this.getLogTypes(types => {
        let isAvailable;

        try {
          isAvailable = Array.isArray(types) && types.indexOf(typeString) >= 0;
        } catch (err) {
          isAvailable = false;
        }

        callback.call(this, isAvailable);
      });
    }
  };

  return new Proxy(Commands, {
    get(target, name) {
      return function(...args) {
        if (typeof target[name] == 'function') {
          return target[name].apply(client.api, args);
        }

        if (args.length === 0 || args.length > 0 && typeof args[args.length - 1] != 'function') {
          args.push(noopFn);
        }

        const targetCopy = target[name].slice(0);
        const method = targetCopy.shift();
        const combinedArgs = targetCopy.concat(args);

        return client.api[method](...combinedArgs);
      };
    }
  });
};
