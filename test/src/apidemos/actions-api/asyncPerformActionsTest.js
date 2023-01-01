const path = require('path');
const nock = require('nock');
const assert = require('assert');
const common = require('../../../common.js');
const nocks = require('../../../lib/nocks.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('actions api tests - async perform', function() {

  before(function () {
    nocks.cleanAll();
    try {
      nocks.enable();
    } catch (e) {
    }

  });
  after(function(){
    nocks.disable();
  });

  it('run basic test with actions and async perform callback', function() {
    let actionsPerformed = false;
    const testsPath = path.join(__dirname, '../../../apidemos/actions-api/asyncActionsApi.js');

    nocks
      .createW3cSession()
      .urlW3c()
      .elementFoundW3c()
      .deleteW3cSession();


    nock('http://localhost:10195')
      .post('/session/13521-10219-202/actions')
      .reply(200, function() {
        actionsPerformed = true;

        return {
          value: null
        };
      });


    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
        assert.strictEqual(actionsPerformed, true);
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      selenium_host: null,
      output: false,
      globals
    }));
  });

});
