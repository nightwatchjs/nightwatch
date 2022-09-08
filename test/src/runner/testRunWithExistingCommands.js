const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunWithExistingCommands', function () {

  it('testRunner with element locate errors enabled', function () {
    let testsPath = path.join(__dirname, '../../sampletests/');

    let globals = {
      retryAssertionTimeout: 90,
      abortOnElementLocateError: true,
      waitForConditionTimeout: 90,
      waitForConditionPollInterval: 90,
      reporter(results, cb) {

        cb();
      }
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      output: true,
      custom_commands_path: [path.join(__dirname, '../../extra/existing-custom-commands')],
      globals
    })).catch(err => {
      assert.strictEqual(err.message, 'Error while loading the API commands: the command .click() is already defined.');
      assert.strictEqual(err.name, 'TypeError');
    })

  });


});
