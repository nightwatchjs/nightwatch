var MockServer  = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testCommand : function(test) {
    var client = this.client.api;

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/location',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : {
          x : 1,
          y : 0
        }
      })
    });

    client.getLocation('css selector', '#weblogin', function callback(result) {
      test.deepEqual(result.value, {x : 1,y : 0});
    }).getLocation('#weblogin', function callback(result) {
      test.deepEqual(result.value, {x : 1,y : 0});
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
