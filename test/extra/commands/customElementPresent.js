const common = require('../../common.js');
const waitForElementPresent = common.require('api/element-commands/waitForElementPresent.js');

module.exports = class CustomElement extends waitForElementPresent {
  constructor() {
    super();

    this.expectedValue = 'custom';
  }

  async command() {
    await super.command();

    this.emit('complete')
  }
};
