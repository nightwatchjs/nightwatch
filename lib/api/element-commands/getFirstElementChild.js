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

class GetFirstElementChild extends BaseElementCommand {
    
  get extraArgsCount() {
    return 0;
  }
  
  async protocolAction() {

    const result =  await this.executeProtocolAction('getFirstElementChild');
    if (result && result.value) {
      const elementId = this.transport.getElementId(result.value);
      Object.assign(result.value, {
        get getId() {
          return function() {
            return elementId;
          };
        }
      });
    }

    return result;
  }
}

module.exports = GetFirstElementChild;