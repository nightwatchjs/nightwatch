var nightwatch = require('../../index.js');

module.exports = {
  setUp: function (callback) {
    this.client = nightwatch.client({
      selenium_port : 10195,
      silent : true,
      output : false,
      username : 'testusername',
      access_key : '123456'
    }).start().once('error', function() {
      callback();
      process.exit();
    });

    callback();
  },

  'Test initialization with credentials' : function(test) {
    var self = this;

    this.client.on('selenium:session_create', function(sessionId, request) {
      var authorization = new Buffer('testusername:123456').toString('base64');
      test.equal(request.request._headers['authorization'], 'Basic ' + authorization, 'Testing if the Authorization header is set correctly');
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client.queue.reset();
    this.client = null;
    // clean up
    callback();
  }
};
