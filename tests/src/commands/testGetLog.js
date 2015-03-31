var MockServer  = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testCommand : function(test) {
    var client = this.client.api;

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/log',
      method:'POST',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : [ { 'level': 'info', 'timestamp': 534547832, 'message': 'Test log' }, { 'level': 'info', 'timestamp': 534547442, 'message': 'Test log2' } ]
      })
    });

    client.getLog('browser', function(result) {
      test.equals(Array.isArray(result), true);
      test.equals(result.length, 2);
      test.equals(result[0].message, 'Test log');
      test.equals(result[1].message, 'Test log2');
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
