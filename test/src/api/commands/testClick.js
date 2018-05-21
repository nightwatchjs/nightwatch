const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('click', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.click()', function(done) {
    MockServer.addMock({
      'url' : '/wd/hub/session/1352110219202/element/0/click',
      'response' : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    this.client.api.click('#weblogin', function callback(result) {
      assert.equal(result.status, 0);
    }).click('css selector', '#weblogin', function callback(result) {
      assert.equal(result.status, 0);
    });

    this.client.start(done);
  });

  it('client.click() with xpath', function(done) {
    MockServer.addMock({
      'url' : '/wd/hub/session/1352110219202/element/0/click',
      'response' : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    this.client.api.useXpath()
      .click('//weblogin', function callback(result) {
        assert.equal(result.status, 0);
      })
      .click('css selector', '#weblogin', function callback(result) {
        assert.equal(result.status, 0);
      });

    this.client.start(done);
  });
});
