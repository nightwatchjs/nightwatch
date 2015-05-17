var nock = require('nock');
module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  'test clearValue command' : function(test) {
    var client = this.client.api;
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/element/0/clear')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        state : null
      });

    client
      .clearValue('#weblogin', function callback(result) {
        test.equals(result.status, 0);
      })
      .clearValue('css selector', '#weblogin', function callback(result) {
        test.equals(result.status, 0);
        test.done();
      });

  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
