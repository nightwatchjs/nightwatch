const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');

describe('window w3c commands', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.setWindowRect()', function (done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/rect',
      method: 'POST',
      response: JSON.stringify({
        value: null
      })
    });

    this.client.api.setWindowRect({width: 100, height: 100}, function(res) {
      assert.strictEqual(res.value, null);
    });

    this.client.start(done);
  });

  it('client.getWindowRect()', function (done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/rect',
      method: 'GET',
      response: JSON.stringify({
        value: {
          width: 1000,
          height: 1000,
          x: 100,
          y: 100
        }
      })
    });

    this.client.api.getWindowRect(function(value) {
      assert.deepStrictEqual(value, {width: 1000, height: 1000, x: 100, y: 100});
    });

    this.client.start(done);
  });

  

});

