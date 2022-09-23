/**
 * Injects the [axe-core](https://github.com/dequelabs/axe-core) js library into the current page (using the .executeScript() command).
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
 * @method axeInject
 * @link https://github.com/dequelabs/axe-core
 * @syntax browser.axeInject()
 * @api protocol.accessibility
 * @since 2.3.6
 */
module.exports = class AxeInjectAbstract {
  static get allowOverride() {
    return true;
  }
};