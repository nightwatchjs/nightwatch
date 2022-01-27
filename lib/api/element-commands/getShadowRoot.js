const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * @method getShadowRoot
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

