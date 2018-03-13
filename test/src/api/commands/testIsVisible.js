var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

describe('isVisible', function() {
  afterEach : function() {
    MockServer.removeMock({
      url : '/wd/hub/session/1352110219202/element/0/displayed',
      method:'GET'
    });
  },

  it('client.isVisible()', function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/displayed',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : true
      })
    });

    client.isVisible('css selector', '#weblogin', function callback(result) {
      assert.equal(result.value, true);
    }).isVisible('#weblogin', function callback(result) {
      assert.equal(result.value, true);
      done();
    });

    Nightwatch.start();
  }
});
