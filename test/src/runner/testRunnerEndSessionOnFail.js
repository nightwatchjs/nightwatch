const path = require('path');
const assert = require('assert');
const nock = require('nock');
const nocks = require('../../lib/nocks');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('test runner with end_session_on_fail flag', function() {

  before(function(done) {
    nocks.enable().cleanAll();
    CommandGlobals.beforeEach.call(this, done);
    
  });

  after(function(done) {
    nocks.disable();
    CommandGlobals.afterEach.call(this, done);
  });


  it('session is not ended with end_on_sessiion_fail: false', function() {
    let endSessionCalled = false;
    const testFile = path.join(__dirname, '../../sampletests/withfailures/sample.js');

    nocks.createSession()
      .url()
      .elementNotFound('#weblogin');
   

    nock('http://localhost:10195')
      .delete('/wd/hub/session/1352110219202')
      .reply(204, ()=> {
        endSessionCalled = true;
      
        return '';
      });

    return runTests(testFile, settings({
      enable_fail_fast: true,
      end_session_on_fail: false,
      globals: {
        waitForConditionPollInterval: 5,
        waitForConditionTimeout: 5,
        retryAssertionTimeout: 1
      }
    })).catch(_ => {
      assert.strictEqual(endSessionCalled, false);
    });


  });

});
