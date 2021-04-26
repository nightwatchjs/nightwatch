/**
 * Checks if the given element contains the specified text.
 *
 * ```
 *   this.demoTest = function (browser) {
 *     browser.assert.containsText('#main', 'The Night Watch');
 *   };
 * ```
 *
 * @method containsText
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} expectedText The text to look for.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(definition, expectedText, msg) {
  this.options = {
    elementSelector: true
  };

  /*!
   * Returns the message format which will be used to output the message in the console and also
   *  the arguments which will be used for replace the place holders, used in the order of appearance
   */
  this.formatMessage = function() {
    const message = msg || `Testing if element %s ${this.negate ? 'does not contain text %s' : 'contains text %s'}`;

    return {
      message,
      args: [this.elementSelector, `'${expectedText}'`]
    };
  };

  /*!
   * Returns the expected value of the assertion which is displayed in the case of a failure
   *
   * @return {string}
   */
  this.expected = function() {
    return this.negate ? `does not contain text '${expectedText}'` : `contains text '${expectedText}'`;
  };

  /*!
   * Given the value, the condition used to evaluate if the assertion is passed
   * @param {*} value
   * @return {Boolean}
   */
  this.evaluate = function(value) {
    if (typeof value != 'string') {
      return false;
    }

    return value.includes(expectedText);
  };

  /*!
   * When defined, this method is called by the assertion runner with the command result, to determine if the
   *  value can be retrieved successfully from the result object
   *
   * @param result
   * @return {boolean|*}
   */
  this.failure = function(result) {
    return result === false || result && result.status === -1;
  };

  /*!
   * Called with the result object of the command to retrieve the value which is to be evaluated
   *
   * @param {Object} result
   * @return {*}
   */
  this.value = function(result) {
    return result.value;
  };

  /*!
   * When defined, this method is called by the assertion runner with the command result to determine the actual
   *  state of the assertion in the event of a failure
   *
   * @param {Boolean} passed
   * @return {string}
   */
  this.actual = function(passed) {
    return passed ? `contains '${expectedText}'` : `does not contain '${expectedText}'`;
  };

  /*!
   * The command which is to be executed by the assertion runner
   * @param {function} callback
   */
  this.command = function(callback) {
    this.api.getText(definition, callback);
  };
};
