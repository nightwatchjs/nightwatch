const assert = require('assert');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getAriaRole', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getAriaRole()', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/computedrole',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 'combobox'
      })
    });

    this.client.api
      .getAriaRole('#weblogin', function callback(result) {
        assert.strictEqual(result.value, 'combobox');
      })
      .getAriaRole('css selector', '#weblogin', function callback(result) {
        assert.strictEqual(result.value, 'combobox');
      })
      .getAriaRole(
        'css selector',
        {
          selector: '#weblogin',
          timeout: 100
        },
        function callback(result) {
          assert.strictEqual(result.value, 'combobox');
        }
      )
      .getAriaRole(
        {
          selector: '#weblogin',
          timeout: 100
        },
        function callback(result) {
          assert.strictEqual(result.value, 'combobox');
        }
      );

    this.client.start(done);
  });
});
