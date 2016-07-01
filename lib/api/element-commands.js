var util = require('util');
var events = require('events');
var Logger = require('../util/logger.js');
var Utils = require('../util/utils.js');

module.exports = function(client) {
  var Protocol = require('./protocol.js')(client);
  var returnValue = {};
  var elementCommands = {};

  /**
   * Simulates a click event on the given DOM element. Uses `elementIdClick` protocol command.
   *
   * ```
   * this.demoTest = function (client) {
   *   client.click("#main ul li a.first");
   * };
   * ```
   *
   * @method click
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdClick
   * @api commands
   */
  elementCommands.click = 'elementIdClick';

  /**
   * Clear a textarea or a text input element's value. Uses `elementIdValue` protocol command.
   *
   * ```
   * this.demoTest = function (client) {
   *   client.clearValue('input[type=text]');
   * };
   * ```
   *
   * @method clearValue
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdClear
   * @api commands
   */
  elementCommands.clearValue = 'elementIdClear';

  /**
   * Retrieve the value of an attribute for a given DOM element. Uses `elementIdAttribute` protocol command.
   *
   * ```
   * this.demoTest = function (client) {
   *   client.getAttribute("#main ul li a.first", "href", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value, "#home");
   *   });
   * };
   * ```
   *
   * @method getAttribute
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {string} attribute The attribute name to inspect.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdAttribute
   * @returns {*} The value of the attribute
   * @api commands
   */
  elementCommands.getAttribute = ['elementIdAttribute', 1];

  /**
   * Retrieve the value of a css property for a given DOM element. Uses `elementIdCssProperty` protocol command.
   *
   * ```
   * this.demoTest = function (client) {
   *   client.getCssProperty("#main ul li a.first", "display", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value, 'inline');
   *   });
   * };
   * ```
   *
   * @method getCssProperty
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {string} cssProperty The CSS property to inspect.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdCssProperty
   * @returns {*} The value of the css property
   * @api commands
   */
  elementCommands.getCssProperty = ['elementIdCssProperty', 1];

  /**
   * Determine an element's size in pixels. Uses `elementIdSize` protocol command.
   *
   * ```
   * this.demoTest = function (client) {
   *   client.getElementSize("#main ul li a.first", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value.width, 500);
   *     this.assert.equal(result.value.height, 20);
   *  });
   * };
   * ```
   *
   * @method getElementSize
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdSize
   * @returns {{width: number, height: number}} The width and height of the element in pixels
   * @api commands
   */
  elementCommands.getElementSize = 'elementIdSize';

  /**
   * Determine an element's location on the page. The point (0, 0) refers to the upper-left corner of the page.
   *
   * The element's coordinates are returned as a JSON object with x and y properties. Uses `elementIdLocation` protocol command.
   *
   * ```
   * this.demoTest = function (client) {
   *   client.getLocation("#main ul li a.first", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value.x, 200);
   *     this.assert.equal(result.value.y, 200);
   *   });
   * };
   * ```
   *
   * @method getLocation
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdLocation
   * @returns {x:number, y:number} The X and Y coordinates for the element on the page.
   * @api commands
   */
  elementCommands.getLocation = 'elementIdLocation';

  /**
   * Determine an element's location on the screen once it has been scrolled into view. Uses `elementIdLocationInView` protocol command.
   *
   * ```
   * this.demoTest = function (browser) {
   *   browser.getLocationInView("#main ul li a.first", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value.x, 200);
   *     this.assert.equal(result.value.y, 200);
   *   });
   * };
   * ```
   *
   * @method getLocationInView
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdLocationInView
   * @returns {x: number, y: number} The X and Y coordinates for the element on the page.
   * @api commands
   */
  elementCommands.getLocationInView = 'elementIdLocationInView';

  /**
   * Query for an element's tag name. Uses `elementIdName` protocol command.
   *
   * ```
   * this.demoTest = function (client) {
   *   client.getTagName("#main ul li .first", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value, "a");
   *   });
   * };
   * ```
   *
   * @method getTagName
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdName
   * @returns {number} The element's tag name, as a lowercase string.
   * @api commands
   */
  elementCommands.getTagName = 'elementIdName';

  /**
   * Returns the visible text for the element. Uses `elementIdText` protocol command.
   *
   * ```
   * this.demoTest = function (browser) {
   *   browser.getText("#main ul li a.first", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value, "nightwatchjs.org");
   *   });
   * };
   * ```
   *
   * @method getText
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdText
   * @returns {string} The element's visible text.
   * @api commands
   */
  elementCommands.getText = 'elementIdText';

  /**
   * Returns a form element current value. Uses `elementIdValue` protocol command.
   *
   * ```
   * this.demoTest = function (browser) {
   *   browser.getValue("form.login input[type=text]", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value, "enter username");
   *   });
   * };
   * ```
   *
   * @method getValue
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdValue
   * @returns {string} The element's value.
   * @api commands
   */
  elementCommands.getValue = 'elementIdValue';

  /**
   * Determine if an element is currently displayed. Uses `elementIdDisplayed` protocol command.
   *
   * ```
   * this.demoTest = function (browser) {
   *   browser.isVisible('#main', function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value, true);
   *   });
   * };
   * ```
   *
   * @method isVisible
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdDisplayed
   * @api commands
   */
  elementCommands.isVisible = 'elementIdDisplayed';

  /**
   * Move the mouse by an offset of the specified element. Uses `moveTo` protocol command.
   *
   * ```
   * this.demoTest = function (browser) {
   *   browser.moveToElement('#main', 10, 10);
   * };
   * ```
   *
   * @method moveToElement
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {number} xoffset X offset to move to, relative to the top-left corner of the element.
   * @param {number} yoffset Y offset to move to, relative to the top-left corner of the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see moveTo
   * @api commands
   */
  elementCommands.moveToElement = ['moveTo', 2];

  /**
   * Sends some text to an element. Can be used to set the value of a form element or to send a sequence of key strokes to an element. Any UTF-8 character may be specified.
   *
   * An object map with available keys and their respective UTF-8 characters, as defined on [W3C WebDriver draft spec](http://www.w3.org/TR/webdriver/#character-types), is loaded onto the main Nightwatch instance as `client.Keys`.
   *
   * ```
   * // send some simple text to an input
   * this.demoTest = function (browser) {
   *   browser.setValue('input[type=text]', 'nightwatch');
   * };
   * //
   * // send some text to an input and hit enter.
   * this.demoTest = function (browser) {
   *   browser.setValue('input[type=text]', ['nightwatch', browser.Keys.ENTER]);
   * };
   * ```
   *
   * @link /session/:sessionId/element/:id/value
   * @method setValue
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {string|array} value The text to send to the element or key strokes.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdValue
   * @api commands
   */
  elementCommands.setValue = ['elementIdValue', 1];

  /**
   * Submit a FORM element. The submit command may also be applied to any element that is a descendant of a FORM element. Uses `submit` protocol command.
   *
   * ```
   * this.demoTest = function (browser) {
   *   browser.submitForm('form.login');
   * };
   * ```
   *
   * @method submitForm
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see submit
   * @api commands
   */
  elementCommands.submitForm = 'submit';

  function addElementCommand(protocolAction, extraArgs) {
    extraArgs = extraArgs || 0;
    var expectedArgs = 3 + extraArgs;
    return function commandActionFn() {
      var originalStackTrace = commandActionFn.stackTrace;
      var noopFn = function() {};
      var args  = Array.prototype.slice.call(arguments, 0);
      if (typeof args[args.length-1] !== 'function') {
        args.push(noopFn);
      }

      var defaultUsing = client.locateStrategy || 'css selector';
      if (expectedArgs - args.length === 1) {
        args.unshift(defaultUsing);
      }

      if (args.length < expectedArgs - 1 || args.length > expectedArgs) {
        throw new Error(protocolAction + ' method expects ' + (expectedArgs - 1) + ' or ' + expectedArgs + ' arguments - ' + args.length + ' given.');
      }

      var using = args.shift();
      var value = args.shift();
      var callback = args.pop();

      return new CommandAction(using, value, protocolAction, args, callback, originalStackTrace);
    };
  }

  function CommandAction(using, value, protocolAction, args, callback, originalStackTrace) {
    events.EventEmitter.call(this);

    var $this = this;
    var el = Protocol.element(using, value, function(result) {
      if (result.status !== 0) {
        callback.call(client.api, result);
        var errorMessage = 'ERROR: Unable to locate element: "' + value + '" using: ' + using;
        var stack = originalStackTrace.split('\n');

        stack.shift();
        Utils.showStackTraceWithHeadline(errorMessage, stack);

        client.results.errors++;
        client.errors.push(errorMessage + '\n' + stack.join('\n'));

        $this.emit('complete', el, $this);
      } else {
        result = result.value.ELEMENT;

        args.push(function(r) {
          callback.call(client.api, r);
        });

        args.unshift(result);

        var c = Protocol[protocolAction].apply(Protocol, args).once('complete', function() {
          $this.emit('complete', c, $this);
        });
      }
    });
  }

  util.inherits(CommandAction, events.EventEmitter);

  Object.keys(elementCommands).forEach(function(commandName) {
    var args = elementCommands[commandName];
    if (!Array.isArray(args)) {
      args = [args];
    }

    returnValue[commandName] = addElementCommand.apply(client.api, args);
  });

  // alias
  returnValue.sendKeys = returnValue.setValue;

  return returnValue;
};
