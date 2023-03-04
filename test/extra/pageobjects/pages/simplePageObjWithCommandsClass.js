const assert = require('assert');
const CommonCommands = require('../commands/helperCommandsClass.js');

class PageCommands extends CommonCommands {
  constructor() {
    super();

    assert.strictEqual(this.api.sessionId, '1352110219202');
    assert.strictEqual(this.browser.sessionId, '1352110219202');
    assert.strictEqual(this.client.api.sessionId, '1352110219202');
    assert.ok(this.transportActions);
    assert.ok(this.driver);
    assert.ok(this.section);
    assert.ok(this.page);
    assert.ok(typeof this.httpRequest == 'function');
    assert.ok(typeof this.toString == 'function');
  }

  basicCommand() {
    const basic = super.basicCommand();

    return {
      ...basic,
      otherResult: 'from-other-helper-class'
    };
  }
}

module.exports = {
  url: 'http://localhost.com',
  elements: {
    loginAsString: '#weblogin',
    loginCss: {selector: '#weblogin'},
    loginIndexed: {
      selector: '#weblogin',
      index: 1
    },
    loginXpath: {
      selector: '//weblogin',
      locateStrategy: 'xpath'
    },
    loginId: {
      selector: 'weblogin',
      locateStrategy: 'id'
    }
  },

  commands: [PageCommands]
};
