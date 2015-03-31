
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var Runner = require('../../../'+ BASE_PATH +'/runner/run.js');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    callback();
  },

  testUseXpath : function(test) {
    var client = this.client;
    this.client.api.useXpath(function() {
      test.equals(client.locateStrategy, 'xpath');
      test.done();
    });

  },

  testUseCss : function(test) {
    var client = this.client;
    this.client.api.useCss(function() {
      test.equals(client.locateStrategy, 'css selector');
      test.done();
    });

  },

  'test run sample test with xpath' : function(test) {
    test.expect(3);

    Runner.run([process.cwd() + '/sampletests/usexpath'], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : test
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;

    callback();
  }
};
