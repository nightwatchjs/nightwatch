const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer  = require('../../../../lib/mockserver.js');

describe('Locate strategies', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.useXpath()', function(done) {
    let client = this.client;
    this.client.api.useXpath(function() {
      assert.strictEqual(client.locateStrategy, 'xpath');
    });

    this.client.start(done);
  });

  it('browser.useCss()', function(done) {
    let client = this.client;
    this.client.api.useCss(function() {
      assert.strictEqual(client.locateStrategy, 'css selector');
    });

    this.client.start(done);
  });

  it.only('strategy switched without useXpath()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata: {
        using: 'xpath',
        value: '//*'
      },
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: [{'ELEMENT': '0'}]
      })
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata: {
        using: 'css selector',
        value: '*'
      },
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: [{'ELEMENT': '1'}]
      })
    });

    this.client.api.findElement('//*', function(result, instance) {
      assert.strictEqual(instance.strategy, 'xpath');
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value.getId(), '0');
    });

    this.client.api.findElement('*', function(result, instance) {
      assert.strictEqual(instance.strategy, 'css selector');
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value.getId(), '1');
    });

    this.client.start(done);
  });
});
