/**
 * Analyzes the current page against applied axe rules.
 *
 * @example
 * describe('accessibility testing', function() {
 *
 *   it('accessibility rule subset', function(browser) {
 *     browser
 *       .url('https://www.w3.org/WAI/demos/bad/after/home.html')
 *       .assert.titleEquals('Welcome to CityLights! [Accessible Home Page]')
 *       .axeInject()
 *       .axeRun('body', {
 *         runOnly: ['color-contrast', 'image-alt'],
 *       });
 *   });
 * })
 *
 * @method axeRun
 * @link https://github.com/dequelabs/axe-core
 * @syntax browser.axeRun('body')
 * @param {string} selector The CSS selector used to locate the element.
 * @param {object} options Object containing rules configuration to use when performing the analysis
 * @see https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter
 * @param {function} [callback] Optional callback function which is called with the results
 * @api protocol.accessibility
 * @since 2.3.6
 */
module.exports = class AxeInject {
  static get allowOverride() {
    return true;
  }
};
