const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Can be done using .executeScript() or the new getShadowRoot command from Selenium
 *
 * See also:
 *  - https://developer.mozilla.org/en-US/docs/Web/API/Element/shadowRoot
 *
 *  Example of how to get a WebElement using .execute()
 *  - https://github.com/nightwatchjs/nightwatch/issues/192#issuecomment-951730392
 *
 * @method getShadowRoot
 */
class ElementCommand extends BaseElementCommand {

}

module.exports = ElementCommand;

