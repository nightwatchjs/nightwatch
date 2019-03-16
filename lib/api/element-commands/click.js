const BaseElementCommand = require('./_baseElementCommand.js');

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
class ClickElement extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'clickElement';
  }
}

module.exports = ClickElement;
