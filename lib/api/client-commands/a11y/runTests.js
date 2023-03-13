const ClientCommand = require('../_base-command.js');

/**
 * Analyzes the current page against applied axe rules.
 *
 * The `selector` and `options` arguments can also be specified in the Nightwatch globals and omitted from the command while writing test. See [here](https://github.com/reallymello/nightwatch-axe-verbose#global-configuration) for more information.
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
 * });
 *
 * @syntax .a11y.runTests([callback])
 * @syntax .a11y.runTests(selector, [callback])
 * @syntax .a11y.runTests(selector, options, [callback])
 * @method a11y.runTests
 * @param {string} [selector] The CSS selector used to locate the element. Considers `axeSettings.context` globals configuration when omitted. Defaults to 'html'.
 * @param {object} [options] [Rules configuration](https://www.deque.com/axe/core-documentation/api-documentation/#user-content-options-parameter) to use when performing the analysis. Considers `axeSettings.options` globals configuration when omitted. Default to `{}`.
 * @param {function} [callback] Callback function which is called with the result value.
 * @link https://github.com/dequelabs/axe-core
 * @api protocol.accessibility
 */
class AxeRunTests extends ClientCommand {
  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    this.api.axeInject().axeRun(this.axeSelector, this.axeOptions, callback);
  }

  command(selector, options = {}, callback) {
    this.axeSelector = selector;
    this.axeOptions = options;

    if (arguments.length === 1 && typeof arguments[0] === 'function') {
      callback = arguments[0];
      this.axeSelector = null;
      this.axeOptions = {};
    } else if (arguments.length === 2 && typeof arguments[1] === 'function') {
      callback = arguments[1];
      this.axeOptions = {};
    }

    return super.command(callback);
  }
};

module.exports = AxeRunTests;
