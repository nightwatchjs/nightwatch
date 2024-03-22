/**
 * Returns a context for the given element which can be used for querying child elements.
 *
 * @example
 * describe('example using within()', function() {
 *
 *   it('click a button within the element', async function(browser) {
 *     const context = browser.within('#weblogin');
 *     await context.click('button');
 *   });
 * })
 *
 * @method within
 * @syntax browser.within('#element').click('button');
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @api protocol.elements
 * @since 2.5.5
 */
module.exports = class WithinAbstract {
  static get allowOverride() {
    return true;
  }
};
