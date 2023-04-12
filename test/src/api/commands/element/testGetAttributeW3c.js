const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');

describe('getAttribute', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getAttribute()', function(done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: 'test_class'
      })
    }, true, true);

    this.client.api.getAttribute('#weblogin', 'class', function callback(result) {
      assert.strictEqual(result.value, 'test_class');
    }).getAttribute('css selector', '#weblogin', 'class', function callback(result) {
      assert.strictEqual(result.value, 'test_class');
    });

    this.client.start(done);
  });

  it('client.getAttribute() -- appium', function(done) {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/elements',
        postdata: {
          using: 'id',
          value: 'com.app:id/weblogin'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '999'}]
        })
      }, true, true)
      .addMock({
        url: '/session/13521-10219-202/element/999/attribute/class',
        method: 'GET',
        response: JSON.stringify({
          value: 'test_class'
        })
      }, true, true);

    // Make appium client
    this.client.api.options.selenium.use_appium = true;

    this.client.api.getAttribute('id', 'com.app:id/weblogin', 'class', function callback(result) {
      assert.strictEqual(result.value, 'test_class');
    }).getAttribute({selector: 'com.app:id/weblogin', locateStrategy: 'id'}, 'class', function callback(result) {
      assert.strictEqual(result.value, 'test_class');
    });

    this.client.start(done);
  });
});
