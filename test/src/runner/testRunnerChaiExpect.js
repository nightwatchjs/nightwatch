var path = require('path');
var assert = require('assert');
var common = require('../../common.js');
var CommandGlobals = require('../../lib/globals/commands.js');

module.exports = {
  'testRunnerChaiExpect': {
    before: function (done) {
      CommandGlobals.beforeEach.call(this, done);
    },

    after: function (done) {
      CommandGlobals.afterEach.call(this, done);
    },

    testRunWithChaiExpect : function(done) {
      var testsPath = path.join(__dirname, '../../sampletests/withchaiexpect');
      var Runner = common.require('runner/run.js');

      var runner = new Runner([testsPath], {
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
        if (err) {
          throw err;
        }
        assert.equal(results.modules.sampleWithChai.tests, 2);
        assert.equal(results.modules.sampleWithChai.failures, 0);
        done();
      });

      runner.run().catch(function (err) {
        done(err);
      });
    }
  }


};
