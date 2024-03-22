const assert = require('assert');
const common = require('../../common.js');
const waitForElementPresent = common.require('api/element-commands/waitForElementPresent.js');

module.exports = class CustomElement extends waitForElementPresent {
  constructor() {
    super();

    this.expectedValue = 'custom';
  }

  async command() {
    await super.command();

    // check that this.transportActions are available
    assert.strictEqual(typeof this.transportActions, 'object');

    const getUrl = await this.transportActions.getCurrentUrl();
    assert.deepStrictEqual(getUrl, {
      status: 0,
      value: 'http://localhost'
    });

    assert.strictEqual(typeof this.transportActions.getStatus, 'function');
    assert.strictEqual(typeof this.transportActions.setTimeoutType, 'function');

    const response = await this.httpRequest({
      path: '/session/:sessionId/url',
      sessionId: '1352110219202',
      host: '',
      port: '',
      data: {
        url: 'http://localhost/test_url'
      },
      method: 'POST'
    });

    assert.deepStrictEqual(response, {status: 0});

    this.emit('complete');
  }
};
