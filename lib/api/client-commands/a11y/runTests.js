const ClientCommand = require('../_base-command.js');

/**
 * Analyzes the current page against applied axe rules.
 *
 * @example
 * describe('accessibility testing', function() {
 *   it('accessibility rule subset', function(browser) {
 *     browser
 *       .url('https://www.w3.org/WAI/demos/bad/after/home.html')
 *       .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
 *       .a11y.runTests('body', {
 *         runOnly: ['color-contrast', 'image-alt'],
 *       });
 *   });
 * })
 *
 * @syntax .a11y.runTests(selector, [callback])
 * @syntax .a11y.runTests(selector, options, [callback])
 * @method a11y.runTests
 * @param {string} selector The CSS selector used to locate the element.
 * @param {object} [options] Object containing [rules configuration](https://www.deque.com/axe/core-documentation/api-documentation/#user-content-options-parameter) to use when performing the analysis.
 * @param {function} callback Callback function which is called with the result value.
 * @link https://github.com/dequelabs/axe-core
 * @api protocol.accessibility
 * @since 2.3.6
 */
class AxeRunTests extends ClientCommand {
  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    this.api.axeInject().axeRun(this.axeSelector, this.axeOptions, callback);
  }

  command(selector, options = {}, callback) {
    if (typeof selector !== 'string') {
      throw new Error('First argument passed to .a11y.runTests() must be a selector string.');
    }

    this.axeSelector = selector;
    this.axeOptions = options;

    if (arguments.length === 2 && typeof arguments[1] == 'function') {
      this.axeOptions = {};
      callback = arguments[1];
    }

    return super.command(callback);
  }
};

module.exports = AxeRunTests;
