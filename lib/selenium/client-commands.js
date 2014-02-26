module.exports = {
  commands : {
    /**
     * Change focus to another window. The window to change focus to may be specified
     * by its server assigned window handle, or by the value of its name attribute.
     *
     * @param {String} handleOrName The window to change focus to.
     * @param {Function} callback
     */
    switchWindow : function(handleOrName, callback) {
      var self = this;
      return this.window('POST', handleOrName, function(result) {
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      });
    },

    saveScreenshot : function(fileName, callback) {
      var self = this;
      return this.screenshot(function(result) {
        self.saveScreenshotToFile(fileName, result.value);
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      });
    },

    /**
     * Resizes the current window.
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Function} callback
     */
    resizeWindow : function(width, height, callback) {
      var self = this;
      return this.windowSize('current', width, height, function() {
        if (typeof callback === 'function') {
          callback.call(self, result);
        }
      });
    },

    getTitle : function(callback) {
      var self = this;
      return this.runCommand('title', [], function(result) {
        callback.call(self, result.value);
      });
    },

    /**
     * Closes the session. Uses session protocol command.
     *
     * ```
     *    this.demoTest = function (client) {
     *      client.closeWindow();
     *    };
     * ```
     *
     * @method closeWindow
     * @param {function} [callback] Optional callback function to be called when the command finishes.
     *  The callback is called with the main instance as context and the result object as the argument.
     * @see protocol.window
     * @since v0.3.0
     * @api commands
     */
    end : function(callback) {
      var self = this;
      return this.session('delete', function(result) {
        self.sessionId = null;
        if (typeof callback == 'function') {
          callback.call(self);
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
     *  The callback is called with the main instance as context and the result object as the argument.
     * @see protocol.window
     * @since v0.3.0
     * @api commands
     */
    closeWindow : function(callback) {
      var self = this;
      return this.window('DELETE', function() {
        if (typeof callback == "function") {
          callback.call(self);
        }
      });
    }
  }
}
