const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');

describe('document.source()', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .document.source()/pageSource()', function(done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/source',
      method: 'GET',
      response: JSON.stringify({
        status: 0,
        value: '<html>Sample HTML</html>'
      })
    }, true, true);

    const api = this.client.api;
    this.client.api.document.source(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, '<html>Sample HTML</html>');
    });
    this.client.api.document.pageSource(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, '<html>Sample HTML</html>');
    });

    this.client.start(done);
  });
});
