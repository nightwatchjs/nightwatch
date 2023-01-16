const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('findElementByPlaceholderText', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.findElementByPlaceholderText()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata: {
        using: 'xpath',
        value: '//input[contains(@placeholder, \'Search docs in Nightwatch\')]'
      },
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: [
          {'ELEMENT': '1'}
        ]
      })
    });

    this.client.api.findElementByPlaceholderText('Search docs in Nightwatch', function callback(result, instance) {
      assert.strictEqual(instance.selector, '//input[contains(@placeholder, \'Search docs in Nightwatch\')]');
      assert.strictEqual(instance.strategy, 'xpath');
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value.getId(), '1');
    });

    this.client.start(done);
  });

  it('client.findElementByPlaceholderText() - exact match', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata: {
        using: 'xpath',
        value: '//input[@placeholder=\'Search docs in Nightwatch\']'
      },
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: [
          {'ELEMENT': '1'}
        ]
      })
    });

    this.client.api.findElementByPlaceholderText('Search docs in Nightwatch', {exact: true}, function callback(result, instance) {
      assert.strictEqual(instance.selector, '//input[@placeholder=\'Search docs in Nightwatch\']');
      assert.strictEqual(instance.strategy, 'xpath');
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value.getId(), '1');
    });

    this.client.start(done);
  });
});
