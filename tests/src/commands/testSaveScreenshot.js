var MockServer  = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testCommand : function(test) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/screenshot',
      method:'GET',
      response : JSON.stringify({
        sessionId: "1352110219202",
        status:0,
        value:'screendata'
      })
    });

    this.client.saveScreenshotToFile = function(fileName, data, cb) {
      test.equal(fileName, 'screenshot.png');
      test.equal(data, 'screendata');
      cb();
    };

    this.client.api.saveScreenshot('screenshot.png', function(result) {
      test.equal(result.value, 'screendata');
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;

    callback();
  }
}
