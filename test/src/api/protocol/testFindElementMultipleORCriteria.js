const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('findElementMultipleORCriteria', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.findElementMultipleORCriteria()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata: {
        using: 'xpath',
        value: '//xpath1 | //xpath2'
      },
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: [
          {'ELEMENT': '1'}
        ]
      })
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata: {
        using: 'css selector',
        value: '.css1, .css2'
      },
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: [
          {'ELEMENT': '2'}
        ]
      })
    });

    this.client.api.findElementMultipleORCriteria('.css1', '//xpath1', {
      using: 'xpath',
      value: '//xpath2'
    }, {
      using: 'css selector',
      value: '.css2'
    }, function callback(result) {
      assert.deepEqual(result.value.map(a => a['ELEMENT']), ['2', '1']);
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });
});
