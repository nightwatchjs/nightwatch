module.exports = function() {
  const elementCommands = {};

  /**
   * Simulates a click event on the given DOM element. Uses `elementIdClick` protocol action internally.
   *
   * The element is scrolled into view if it is not already pointer-interactable. See the WebDriver specification for <a href="https://www.w3.org/TR/webdriver/#element-interactability" target="_blank">element interactability</a>
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.click("#main ul li a.first");
   * };
   * 
   *
   * @method click
   * @syntax .click(selector, [callback])
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdClick
   * @api protocol.elementinteraction
   */
  elementCommands.click = 0;

  /**
   * Clear a textarea or a text input element's value. Uses `elementIdValue` protocol action internally.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.clearValue('input[type=text]');
   * };
   * 
   *
   * @method clearValue
   * @syntax .clearValue(selector, [callback])
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdClear
   * @api protocol.elementinteraction
   */
  elementCommands.clearValue = 0;

  /**
   * Retrieve the value of an attribute for a given DOM element. Uses `elementIdAttribute` protocol command.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.getAttribute("#main ul li a.first", "href", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value, "#home");
   *   });
   * };
   * 
   *
   * @method getAttribute
   * @syntax .getAttribute(selector, attribute, callback)
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {string} attribute The attribute name to inspect.
   * @param {function} callback Callback function which is called with the result value.
   * @see elementIdAttribute
   * @returns {*} The value of the attribute
   * @api protocol.elementstate
   */
  elementCommands.getAttribute = 1;

  /**
   * Retrieve the value of a css property for a given DOM element. Uses `elementIdCssProperty` protocol command.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.getCssProperty("#main ul li a.first", "display", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value, 'inline');
   *   });
   * };
   * 
   *
   * @method getCssProperty
   * @syntax .getCssProperty(selector, cssProperty, callback)
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {string} cssProperty The CSS property to inspect.
   * @param {function} callback Callback function which is called with the result value.
   * @see elementIdCssProperty
   * @returns {*} The value of the css property
   * @api protocol.elementstate
   */
  elementCommands.getCssProperty = 1;

  /**
   * Determine an element's size in pixels. Uses `elementIdSize` protocol command.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.getElementSize("#main ul li a.first", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value.width, 500);
   *     this.assert.equal(result.value.height, 20);
   *  });
   * };
   * 
   *
   * @method getElementSize
   * @syntax .getElementSize(selector, callback)
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} callback Callback function which is called with the result value.
   * @see elementIdSize
   * @returns {{width: number, height: number}} The width and height of the element in pixels
   * @api protocol.elementstate
   */
  elementCommands.getElementSize = 0;

  /**
   * Determine an element's location on the page. The point (0, 0) refers to the upper-left corner of the page.
   *
   * The element's coordinates are returned as a JSON object with x and y properties. Uses `elementIdLocation` protocol command.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.getLocation("#main ul li a.first", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value.x, 200);
   *     this.assert.equal(result.value.y, 200);
   *   });
   * };
   * 
   *
   * @method getLocation
   * @syntax .getLocation(selector, callback)
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} callback Callback function which is called with the result value.
   * @see elementIdLocation
   * @returns {{x:number, y:number}} The X and Y coordinates for the element on the page.
   * @api protocol.elementlocation
   */
  elementCommands.getLocation = 0;

  /**
   * Determine an element's location on the screen once it has been scrolled into view. Uses `elementIdLocationInView` protocol command.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.getLocationInView("#main ul li a.first", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value.x, 200);
   *     this.assert.equal(result.value.y, 200);
   *   });
   * };
   * 
   *
   * @method getLocationInView
   * @syntax .getLocationInView(selector, callback)
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} callback Callback function which is called with the result value.
   * @see elementIdLocationInView
   * @returns {{x: number, y: number}} The X and Y coordinates for the element on the page.
   * @api protocol.elementlocation
   */
  elementCommands.getLocationInView = 0;

  /**
   * Query for an element's tag name. Uses `elementIdName` protocol command.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.getTagName("#main ul li .first", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value, "a");
   *   });
   * };
   * 
   *
   * @method getTagName
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @syntax .getTagName(selector, callback)
   * @param {function} callback Callback function which is called with the result value.
   * @see elementIdName
   * @returns {number} The element's tag name, as a lowercase string.
   * @api protocol.elementstate
   */
  elementCommands.getTagName = 0;

  /**
   * Returns the visible text for the element. Uses `elementIdText` protocol command.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.getText("#main ul li a.first", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value, "nightwatchjs.org");
   *   });
   * };
   * 
   *
   * @method getText
   * @syntax .getTagName(selector, callback)
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} callback Callback function which is called with the result value.
   * @see elementIdText
   * @returns {string} The element's visible text.
   * @api protocol.elementstate
   */
  elementCommands.getText = 0;

  /**
   * Returns a form element current value. Uses `elementIdValue` protocol command.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.getValue("form.login input[type=text]", function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value, "enter username");
   *   });
   * };
   * 
   *
   * @method getValue
   * @syntax .getValue(selector, callback)
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} callback Callback function which is called with the result value.
   * @see elementIdValue
   * @returns {string} The element's value.
   * @api protocol.elementstate
   */
  elementCommands.getValue = 0;

  /**
   * Determine if an element is currently displayed. Uses `elementIdDisplayed` protocol command.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.isVisible('#main', function(result) {
   *     this.assert.equal(typeof result, "object");
   *     this.assert.equal(result.status, 0);
   *     this.assert.equal(result.value, true);
   *   });
   * };
   * 
   *
   * @method isVisible
   * @syntax .isVisible(selector, callback)
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} callback Callback function which is called with the result value.
   * @see elementIdDisplayed
   * @api protocol.elementstate
   */
  elementCommands.isVisible = 0;

  /**
   * Move the mouse by an offset of the specified element. Uses `moveTo` protocol command.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.moveToElement('#main', 10, 10);
   * };
   * 
   *
   * @method moveToElement
   * @syntax .moveToElement(selector, xoffset, yoffset, [callback])
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {number} xoffset X offset to move to, relative to the top-left corner of the element.
   * @param {number} yoffset Y offset to move to, relative to the top-left corner of the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see moveTo
   * @api protocol.elementinteraction
   */
  elementCommands.moveToElement = 2;

  /**
   * Sends some text to an element. Can be used to set the value of a form element or to send a sequence of key strokes to an element. Any UTF-8 character may be specified.
   *
   * <div class="alert alert-warning"><strong>setValue</strong> does not clear the existing value of the element. To do so, use the <strong>clearValue()</strong> command.</div>
   *
   * An object map with available keys and their respective UTF-8 characters, as defined on [W3C WebDriver draft spec](http://www.w3.org/TR/webdriver/#character-types), is loaded onto the main Nightwatch instance as `browser.Keys`.
   *
   * @example
   * // send some simple text to an input
   * this.demoTest = function (browser) {
   *   browser.setValue('input[type=text]', 'nightwatch');
   * };
   * //
   * // send some text to an input and hit enter.
   * this.demoTest = function (browser) {
   *   browser.setValue('input[type=text]', ['nightwatch', browser.Keys.ENTER]);
   * };
   * 
   *
   * @link /session/:sessionId/element/:id/value
   * @method setValue
   * @syntax .setValue(selector, inputValue, [callback])
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {string|array} inputValue The text to send to the element or key strokes.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see elementIdValue
   * @api protocol.elementinteraction
   */
  elementCommands.setValue = 1;

  /**
   * Alias for setValue
   *
   * @type {Array}
   */
  elementCommands.sendKeys = elementCommands.setValue;

  /**
   * Submit a FORM element. The submit command may also be applied to any element that is a descendant of a FORM element. Uses `submit` protocol command.
   *
   * @example
   * this.demoTest = function (browser) {
   *   browser.submitForm('form.login');
   * };
   * 
   *
   * @method submitForm
   * @syntax .submitForm(selector, [callback])
   * @param {string} selector The CSS/Xpath selector used to locate the element.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @see submit
   * @api protocol.elementinteraction
   */
  elementCommands.submitForm = 0;

  return elementCommands;
};
