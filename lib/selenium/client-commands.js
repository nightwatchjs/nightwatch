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

      if (!this.launchUrl) {
        return this;
      }
      return this.url(this.launchUrl);
    },

    urlHash : function(hash) {
      if (hash.charAt(0) === '#') {
        hash = hash.substring(1);
      }
      return this.url(this.launchUrl + '#' + hash);
    },

    getCookies : function(callback) {
      return this.cookie('GET', callback);
    },

    setCookie : function(cookie, callback) {
      return this.cookie('POST', cookie, callback);
    },

    deleteCookie : function(cookieName, callback) {
      return this.cookie('DELETE', cookieName, callback);
    },

    deleteCookies : function(callback) {
      return this.cookie('DELETE', callback);
    },

    getCookie : function(name, callback) {
      return this.cookie('GET', function(result) {
        // TODO: implement
        callback(result);
      });
    },

    injectScript : function(scriptUrl, id, callback) {
      var args = [scriptUrl];
      if (arguments.length == 2 && typeof arguments[1] == 'function') {
        callback = arguments[1];
      } else if (typeof id == 'string') {
        args.push(id);
      }

      return this.execute(function(u,i) {/* jshint browser:true */return (function(d){var e=d.createElement('script');var m=d.getElementsByTagName('script')[0];e.src=u;if(i){e.id=i;}m.parentNode.insertBefore(e,m);return e;})(document);}, args, callback);
    },

    initNgMockApp : function(mainUrl, opts, mocks, passThrough) {
      /* jshint browser:true */
      var addDeferBootstrap = function() {return (function(w){w.name='NG_DEFER_BOOTSTRAP!'+w.name;})(window);};
      var scriptUrl = opts.scriptUrl;
      var ngApp = opts.ngApp;

      var bootstrapFn = 'var passedArgs = Array.prototype.slice.call(arguments,0);' +
        '(function(app,skipmocks){' +
        'angular.module(app+".E2E",[app,"ngMockE2E"])' +
          '.run(function($httpBackend) {' +
            'try{(' + mocks.toString() + ')($httpBackend);}catch(err){console.error("Error",err);};' +
            'if (skipmocks && Array.isArray(skipmocks)) {' +
              'var regex = new RegExp(skipmocks.map(function(el) {return el.replace(/\\/+/g,"\\/\") + ".*"}).join(\'|\'));' +
              'angular.forEach(["GET","POST","PUT","DELETE","HEAD"],function(value) {' +
                '$httpBackend.when(value, regex).passThrough();' +
              '})' +
            '}' +
          '});' +
        'document.documentElement.setAttribute("ng-app", "sideline.App.E2E");' +
        'angular.bootstrap(document.documentElement, ["sideline.App.E2E"]);' +
      '}).apply(null, passedArgs)';

      return this.url('about:blank', function() {
        this.execute(addDeferBootstrap, [], function() {
          this.url(mainUrl, function() {
            this.injectScript(scriptUrl, function() {
              this.execute(bootstrapFn, [ngApp,passThrough]);
            });
          });
        });
      });
    }
  };
};
