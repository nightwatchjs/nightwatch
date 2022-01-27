const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Returns the `shadowRoot` read-only property which represents the shadow root hosted by the element. This can further be used to retrieve elements part of the shadow root element.
 *
 * @example
 * describe('Shadow Root example test', function() {
 *   it('retrieve the shadowRoot', async function(browser) {
 *      await browser
 *        .navigateTo('https://mdn.github.io/web-components-examples/popup-info-box-web-component/')
 *        .waitForElementVisible('form');
 *
 *      const shadowRootEl = await browser.getShadowRoot('popup-info');
 *      const infoElement = await shadowRootEl.find('.info');
 *
 *      await expect(infoElement.property('innerHTML')).to.include('card validation code');
 *      const iconElement = await shadowRootEl.find('.icon');
 *      const firstElement = await browser.getFirstElementChild(iconElement);
 *
 *      await expect.element(firstElement).to.be.an('img');
 *    });
 * });
 *
 * @syntax browser.getShadowRoot(selector, callback)
 * @syntax browser.getShadowRoot(selector)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object|WebElement|By} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @method getShadowRoot
 * @since 2.0.0
 * @moreinfo developer.mozilla.org/en-US/docs/Web/API/Element/shadowRoot
 * @api protocol.elements
 */
class ElementCommand extends BaseElementCommand {
  async protocolAction() {
    const result = await this.executeProtocolAction('getShadowRoot');

    if (result && result.value) {
      return this.api.createElement(result.value);
    }

    return result;
  }
}

module.exports = ElementCommand;

