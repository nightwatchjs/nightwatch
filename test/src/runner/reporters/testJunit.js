var assert = require('assert');
var common = require('../../../common.js');
var JunitReporter = common.require('runner/reporters/junit.js');

module.exports = {
  'test adaptErrMessages' : {
    'test start with callback on success' : function() {
      var theModule = {
        completed: {
          fooTestCase: {
            errmessages: ['some error header\nsome stack']
          }
        }
      };

      JunitReporter._adaptErrMessages(theModule);
      assert.equal(theModule.completed.fooTestCase.errorStackTraces[0], 'some stack');
    }
  }
};