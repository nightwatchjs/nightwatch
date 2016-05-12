var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var Globals = require('../../../lib/globals/commands.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('locateStrategies', {

  'client.useXpath()' : function(done) {
    var client = Nightwatch.client();
    var api = Nightwatch.api();

    api.useXpath(function() {
      assert.equal(client.locateStrategy, 'xpath');
      done();
    });

    Nightwatch.start();

  },

  'client.useCss()' : function(done) {
    var client = Nightwatch.client();
    var api = Nightwatch.api();

    api.useCss(function() {
      assert.equal(client.locateStrategy, 'css selector');
      done();
    });

    Nightwatch.start();
  },
  /*
  'test run sample test with xpath' : function(done) {
    //test.expect(3);
    var Runner = common.require('runner/run.js');
    Runner.run([process.cwd() + '/sampletests/usexpath'], {
      seleniumPort : 10195,
      silent : true,
      output : false,
      globals : {
        test : assert
      }
    }, {
      output_folder : false,
      start_session : true
    }, function(err, results) {
      done();
    });
  }
  */
});
