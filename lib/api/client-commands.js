var events = require('events');

module.exports = function(client) {
  return {
    /**
     * Change focus to another window. The window to change focus to may be specified by its server assigned window handle, or by the value of its name attribute.
     *
     * To find out the window handle use `window_handles` protocol action
     *
     * ```
     *  this.demoTest = function (browser) {
     *    browser.window_handles(function(result) {
     *      var handle = result.value[0];
     *      browser.switchWindow(handle);
     *    });
     *  };
     * ```
     *
     * @method switchWindow
     * @param {string} handleOrName The server assigned window handle or the name attribute.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see window
     * @since v0.3.0
     * @api commands
     */
    switchWindow : function(handleOrName, callback) {
      var self = this;
      this.window('POST', handleOrName, function(result) {
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      });
      return this;
    },

    /**
     * Resizes the current window.
     *
     * ```
     *  this.demoTest = function (browser) {
     *    browser.resizeWindow(1000, 800);
     *  };
     * ```
     *
     * @method resizeWindow
     * @param {number} width The new window width.
     * @param {number} height The new window height.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see windowSize
     * @since v0.3.0
     * @api commands
     */
    resizeWindow : function(width, height, callback) {
      var self = this;
      return this.windowSize('current', width, height, function(result) {
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      });
    },

    /**
     * Sets the current window position.
     *
     * ```
     *  this.demoTest = function (browser) {
     *    browser.setWindowPosition(0, 0);
     *  };
     * ```
     *
     * @method setWindowPosition
     * @param {number} offsetX The new window offset x-position.
     * @param {number} offsetY The new window offset y-position.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see windowPosition
     * @since v0.8.18
     * @api commands
     */
    setWindowPosition : function(offsetX, offsetY, callback) {
      var self = this;
      return this.windowPosition('current', offsetX, offsetY, function(result) {
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      });
    },

    /**
     * Maximizes the current window.
     *
     * ```
     *  this.demoTest = function (browser) {
     *    browser.maximizeWindow();
     *  };
     * ```
     *
     * @method maximizeWindow
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see windowMaximize
     * @since v0.5.13
     * @api commands
     */
    maximizeWindow: function(callback) {
      var self = this;
      return this.windowMaximize('current', function(result) {
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      });
    },

    /**
     * Take a screenshot of the current page and saves it as the given filename.
     *
     * ```
     *  this.demoTest = function (browser) {
     *    browser.saveScreenshot('/path/to/fileName.png');
     *  };
     * ```
     *
     * @method saveScreenshot
     * @param {string} fileName The complete path to the file name where the screenshot should be saved.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see screenshot
     * @api commands
     */
    saveScreenshot : function(fileName, callback) {
      var self = this;
      return this.screenshot(client.api.options.log_screenshot_data, function(result) {
        client.saveScreenshotToFile(fileName, result.value, function(err) {
          if (typeof callback === 'function') {
            callback.call(self, result, err);
          }
        });
      });
    },

    /**
     * Returns the title of the current page. Uses title protocol command.
     *
     * ```
     *  this.demoTest = function (browser) {
     *    browser.getTitle(function(title) {
     *      this.assert.equal(typeof title, 'string');
     *      this.assert.equal(title, 'Nightwatch.js');
     *    });
     *  };
     * ```
     *
     * @method getTitle
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see title
     * @returns {string} The page title.
     * @api commands
     */
    getTitle : function(callback) {
      var self = this;
      return this.title(function(result) {
        callback.call(self, result.value);
      });
    },

    /**
     * Close the current window. This can be useful when you're working with multiple windows open (e.g. an OAuth login).
     * Uses `window` protocol command.
     *
     * ```
     * this.demoTest = function (client) {
     *   client.closeWindow();
     * };
     * ```
     *
     * @method closeWindow
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see window
     * @since v0.3.0
     * @api commands
     */
    closeWindow : function(callback) {
      var self = this;
      return this.window('DELETE', function(result) {
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      });
    },

    /**
     * This command is an alias to url and also a convenience method when called without any arguments in the sense that it performs a call to .url() with passing the value of `launch_url` field from the settings file.
     * Uses `url` protocol command.
     *
     * ```
     * this.demoTest = function (client) {
     *   client.init();
     * };
     * ```
     *
     * @method init
     * @param {string} [url] Url to navigate to.
     * @see url
     * @since v0.4.0
     * @api commands
     */
    init : function(url) {
      if (url) {
        return this.url(url);
      }

      if (!this.launchUrl) {
        return this;
      }
      return this.url(this.launchUrl);
    },

    /**
     * Convenience method that adds the specified hash (i.e. url fragment) to the current value of the `launch_url` as set in `nightwatch.json`.
     *
     * ```
     * this.demoTest = function (client) {
     *   client.urlHash('#hashvalue');
     *   // or
     *   client.urlHash('hashvalue');
     * };
     * ```
     *
     * @method urlHash
     * @param {string} hash The hash to add/replace to the current url (i.e. the value set in the launch_url property in nightwatch.json).
     * @see url
     * @since v0.4.0
     * @api commands
     */
    urlHash : function(hash) {
      if (hash.charAt(0) === '#') {
        hash = hash.substring(1);
      }
      return this.url(this.launchUrl + '#' + hash);
    },

    /**
     * Retrieve all cookies visible to the current page. The cookies are returned as an array of cookie JSON object, as defined [here](https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object).
     *
     * Uses `cookie` protocol command.
     *
     * ```
     * this.demoTest = function(browser) {
     *   browser.getCookies(function callback(result) {
     *     this.assert.equal(result.value.length, 1);
     *     this.assert.equals(result.value[0].name, 'test_cookie');
     *   });
     * }
     * ```
     *
     * @method getCookies
     * @param {function} callback The callback function which will receive the response as an argument.
     * @api commands
     * @since v0.4.0
     * @see cookie
     * @returns {Array.<object>} A list of cookies.
     */
    getCookies : function(callback) {
      return this.cookie('GET', callback);
    },

    /**
     * Retrieve a single cookie visible to the current page. The cookie is returned as a cookie JSON object, as defined [here](https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object).
     *
     * Uses `cookie` protocol command.
     *
     * ```
     * this.demoTest = function(browser) {
     *   browser.getCookie(name, function callback(result) {
     *     this.assert.equal(result.value, '123456');
     *     this.assert.equals(result.name, 'test_cookie');
     *   });
     * }
     * ```
     *
     * @method getCookie
     * @param {string} name The cookie name.
     * @param {function} callback The callback function which will receive the response as an argument.
     * @api commands
     * @since v0.4.0
     * @see cookie
     * @returns {object|null} The cookie object as a selenium cookie JSON object or null if the cookie wasn't found.
     */
    getCookie : function(name, callback) {
      var self = this;
      return this.cookie('GET', function(result) {
        if (!result.value || result.value.length === 0) {
          callback.call(self, null);
          return;
        }

        var cookie = null;
        for (var i = 0; i < result.value.length; i++) {
          if (result.value[i].name === name) {
            cookie = result.value[i];
            break;
          }
        }

        callback.call(self, cookie);
      });
    },

    /**
     * Set a cookie, specified as a cookie JSON object, as defined [here](https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object).
     *
     * Uses `cookie` protocol command.
     *
     * ```
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
     * ```
     *
     * @method setCookie
     * @param {object} cookie The cookie object.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @api commands
     * @since v0.4.0
     * @see cookie
     */
    setCookie : function(cookie, callback) {
      return this.cookie('POST', cookie, callback);
    },

    /**
     * Delete the cookie with the given name. This command is a no-op if there is no such cookie visible to the current page.
     *
     * ```
     * this.demoTest = function(browser) {
     *   browser.deleteCookie("test_cookie", function() {
     *     // do something more in here
     *   });
     * }
     * ```
     *
     * @method deleteCookie
     * @param cookieName The name of the cookie to delete.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @api commands
     * @since v0.4.0
     * @see cookie
     */
    deleteCookie : function(cookieName, callback) {
      return this.cookie('DELETE', cookieName, callback);
    },

    /**
     * Delete all cookies visible to the current page.
     *
     * ```
     * this.demoTest = function(browser) {
     *   browser.deleteCookies(function() {
     *     // do something more in here
     *   });
     * }
     * ```
     *
     * @method deleteCookies
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @api commands
     * @since v0.4.0
     * @see cookie
     */
    deleteCookies : function(callback) {
      return this.cookie('DELETE', callback);
    },

    /**
     * Utility command to load an external script into the page specified by url.
     *
     * ```
     * this.demoTest = function(client) {
     *   this.injectScript('http://example.org/js/utility.js', function() {
     *     // we're all done here.
     *   });
     * };
     * ```
     *
     * @method injectScript
     * @param {string} scriptUrl The script file url
     * @param {string} [id] Dom element id to be set on the script tag.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @api commands
     * @since v0.4.0
     * @returns {HTMLScriptElement} The newly created script tag.
     */
    injectScript : function(scriptUrl, id, callback) {
      var args = [scriptUrl];
      if (arguments.length == 2 && typeof arguments[1] == 'function') {
        callback = arguments[1];
      } else if (typeof id == 'string') {
        args.push(id);
      }

      return this.execute(function(u,i) {/* jshint browser:true */return (function(d){var e=d.createElement('script');var m=d.getElementsByTagName('head')[0];e.src=u;if(i){e.id=i;}m.appendChild(e);return e;})(document);}, args, callback);
    },
    
    /**
     * Gets the available log types
     *
     * ```
     * this.demoTest = function(client) {
     *   this.getLogTypes(function(typesArray) {
     *     
     *   });
     * };
     * ```
     *
     * @method getLogTypes
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @api commands
     * @see logTypes
     */
    getLogTypes: function(callback) {
      var self = this;
      return this.sessionLogTypes(function(response) {
        if (callback) {
          callback.call(self, response.value);
        }
      });
    },
    
    /**
     * Gets a log from selenium
     *
     * ```
     * this.demoTest = function(client) {
     *   this.getLog('browser', function(logEntriesArray) {
     *     console.log('Log length: ' + logEntriesArray.length);
     *     logEntriesArray.forEach(function(log) {
     *        console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
     *      });
     *   });
     * };
     * ```
     *
     * @method getLog
     * @param {string|function} typeString Log type to request
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @api commands
     * @see log
     */
    getLog: function(typeString, callback) {
      var self = this;
      if (typeof typeString !== 'string') {
        if (typeof typeString === 'function') {
          callback = typeString;
        }
        typeString = 'browser';
      }
      return this.sessionLog(typeString, function (response) {
        if (callback) {
          callback.call(self, response.value);
        }
      });
    },
      
    /**
     * Utility command to test if the log type is available
     *
     * ```
     * this.demoTest = function(browser) {
     *   browser.isLogAvailable('browser', function(isAvailable) {
     *     // do something more in here
     *   });
     * }
     * ```
     *
     * @method isLogAvailable
     * @param {string|function} typeString Type of log to test
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @api commands
     * @see getLogTypes
     */
    isLogAvailable: function(typeString, callback) {
      var self = this;
      if (typeof typeString !== 'string') {
        if (typeof typeString === 'function') {
          callback = typeString;
        }
        typeString = 'browser';
      }
      return this.getLogTypes(function (types) {
        var isAvailable;
        try {
          isAvailable = Array.isArray(types) && types.indexOf(typeString) >= 0;
        } catch (err) {
          isAvailable = false;
        }

        if (callback) {
          callback.call(self, isAvailable);
        } 
      });
    }

  };
};
