module.exports = function(client) {
  return {
    /**
     * Change focus to another window. The window to change focus to may be specified
     * by its server assigned window handle, or by the value of its name attribute.
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
     * @see protocol.window
     * @since v0.3.0
     * @api commands
     */
    switchWindow : function(handleOrName, callback) {
      var self = this;
      return this.window('POST', handleOrName, function(result) {
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      });
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
     * @param {height} width The new window height.
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see protocol.windowSize
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
     * @see protocol.screenshot
     * @api commands
     */
    saveScreenshot : function(fileName, callback) {
      var self = this;
      return this.screenshot(function(result) {
        client.saveScreenshotToFile(fileName, result.value);
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      });
    },

    /**
     * Returns the title of the current page. Uses title protocol command.
     *
     * ```
     *  this.demoTest = function (browser) {
     *    browser.getTitle(function(result) {
     *      this.assert.equal(typeof result, 'object');
     *      this.assert.equal(result.status, 0);
     *      this.assert.equal(result.value, 'Nightwatch.js');
     *    });
     *  };
     * ```
     *
     * @method getTitle
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see protocol.title
     * @return {string} value|The page title.
     * @api commands
     */
    getTitle : function(callback) {
      var self = this;
      return this.title(function(result) {
        callback.call(self, result.value);
      });
    },

    /**
     * Ends the session. Uses session protocol command.
     *
     * ```
     *    this.demoTest = function (client) {
     *      browser.end();
     *    };
     * ```
     *
     * @method end
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see protocol.session
     * @api commands
     */
    end : function(callback) {
      var self = this;
      return this.session('delete', function(result) {
        client.sessionId = null;
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      });
    },

    /**
     * Close the current window. This can be useful when you're working with multiple windows open (e.g. an OAuth login).
     * Uses window protocol command.
     *
     * ```
     *    this.demoTest = function (client) {
     *      client.closeWindow();
     *    };
     * ```
     *
     * @method closeWindow
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see protocol.window
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
     * This command is an alias to url and also a convenience method when called without any arguments in the sense that it
     * performs a call to .url() with passing the value of `launch_url` field from the settings file.
     * Uses window protocol command.
     *
     * ```
     *    this.demoTest = function (client) {
     *      client.init();
     *    };
     * ```
     *
     * @method init
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     * @see protocol.url
     * @since v0.4.0
     * @api commands
     */
    init : function(url) {
      if (url) {
        return this.url(url);
      }

      if (!this.client.launchUrl) {
        return this;
      }
      return this.url(this.client.launchUrl);
    }
  };
};
