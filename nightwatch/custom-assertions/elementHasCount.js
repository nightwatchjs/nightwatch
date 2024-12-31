/**
 * A custom Nightwatch assertion. The assertion name is the filename.
 *
 * Example usage:
 *   browser.assert.elementHasCount(selector, count)
 *
 * For more information on custom assertions see:
 *   https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-assertions.html
 *
 * @param {string} selector
 * @param {number} count
 */

exports.assertion = function elementHasCount(selector, count) {
  // Message to be displayed on the console while running this assertion.
  this.message = `Testing if element <${selector}> has count: ${count}`;

  // Expected value of the assertion, to be displayed in case of failure.
  this.expected = count;

  // Given the result value (from `this.value` below), this function will
  // evaluate if the assertion has passed.
  this.evaluate = function(value) {
    return value === count;
  };

  // Retrieve the value from the result object we got after running the
  // assertion command (defined below), which is to be evaluated against
  // the value passed into the assertion as the second argument.
  this.value = function(result) {
    return result.value;
  };

  // Script to be executed in the browser to find the actual element count.
  function elementCountScript(_selector) {
    // eslint-disable-next-line
    return document.querySelectorAll(_selector).length;
  }

  // The command to be executed by the assertion runner, to find the actual
  // result. Nightwatch API is available as `this.api`.
  this.command = function(callback) {
    this.api.execute(elementCountScript, [selector], callback);
  };
};
