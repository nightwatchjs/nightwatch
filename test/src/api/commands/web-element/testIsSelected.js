const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('element().isSelected() command', function() {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().isSelected()', function() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/selected',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: true
      })
    });

    this.client.api.element('#weblogin').isSelected(function (result) {
      this.assert.equal(result.value, true);
    });
  });

  it('async test .element().isSelected()', async function() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/selected',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: true
      })
    });

    const resultPromise = this.client.api.element('#weblogin').isSelected();
    const result = await resultPromise;
    assert.equal(result, true);
  });
});

