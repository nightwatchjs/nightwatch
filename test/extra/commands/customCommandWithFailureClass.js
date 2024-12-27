module.exports = class CustomCommandWithFailureClass{
  async command() {
    await this.api.waitForElementPresent('#badElement', 100);
  }
};
