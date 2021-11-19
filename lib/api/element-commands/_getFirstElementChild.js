const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Needs to use either .executeScript() or Selenium 4 relative locators
 *
 * See also:
 *  - https://developer.mozilla.org/en-US/docs/Web/API/Element/firstElementChild
 *
 *  Example of how to get a WebElement using .execute()
 *  - https://github.com/nightwatchjs/nightwatch/issues/192#issuecomment-951730392
 *
 *
 * @method getFirstElementChild
 */

class ElementCommand extends BaseElementCommand {

}

module.exports = ElementCommand;