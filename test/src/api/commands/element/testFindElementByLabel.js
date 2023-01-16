const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('findElementByLabel', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.findElementByLabel()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata: {
        using: 'xpath',
        value: '//*[contains(text(), \'Nightwatch Sign In\')]//following::input[1]'    
      },
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: [
          {'ELEMENT': '1'}
        ]
      })
    });

    this.client.api.findElementByLabel('Nightwatch Sign In', function callback(result, instance) {
      assert.strictEqual(instance.selector, '//*[contains(text(), \'Nightwatch Sign In\')]//following::input[1]');
      assert.strictEqual(instance.strategy, 'xpath');
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value.getId(), '1');
    });

    this.client.start(done);
  });

  it('client.findElementByLabel() - exact match', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata: {
        using: 'xpath',
        value: '//*[text()=\'Nightwatch Sign In\']//following::input[1]'
      },
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: [
          {'ELEMENT': '1'}
        ]
      })
    });

    this.client.api.findElementByLabel('Nightwatch Sign In', {exact: true}, function callback(result, instance) {
      assert.strictEqual(instance.selector, '//*[text()=\'Nightwatch Sign In\']//following::input[1]');
      assert.strictEqual(instance.strategy, 'xpath');
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value.getId(), '1');
    });

    this.client.start(done);
  });
});
