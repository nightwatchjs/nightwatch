module.exports = class CustomWaitForPresent {
  async command(selector) {
    await this.api.waitForElementPresent(selector);
  }
};