const assert = require('assert');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('submitForm', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });


  it('client.submitForm()', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value: null
      }, true, true)
    });

    this.client.api.submitForm('#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    }).submitForm('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });
});
