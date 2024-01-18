/**
 * Analyzes the current page against applied axe rules.
 *
 * @example
 * describe('accessibility testing', function () {
 *   it('accessibility rule subset', function (browser) {
 *     browser
 *       .url('https://www.w3.org/WAI/demos/bad/after/home.html')
 *       .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
 *       .axeInject()
 *       .axeRun('body', {
 *         runOnly: ['color-contrast', 'image-alt'],
 *       });
 *   });
 * });
 *
 * @method axeRun
 * @syntax browser.axeRun('body')
 * @param {*} [context] Defines the scope of the analysis, will cascade to child elements. See [axe-core docs](https://github.com/dequelabs/axe-core/blob/master/doc/API.md#context-parameter) for more details.
 * @param {object} [options] Object containing rules configuration to use when performing the analysis. See [axe-core docs](https://github.com/dequelabs/axe-core/blob/master/doc/API.md#options-parameter) for more details.
 * @param {function} [callback] Optional callback function which is called with the results.
 * @api protocol.accessibility
 * @since 2.3.6
 * @see https://www.deque.com/axe/core-documentation/api-documentation/#api-name-axerun
 */
module.exports = class AxeInject {
  static get allowOverride() {
    return true;
  }
};
