const path = require('path');
const MockServer = require('../../../lib/mockserver.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('find elements with page commands', function() {
  beforeEach(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function(done) {
    this.server.close(function() {
      done();
    });
  });

  it('test custom command', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/elements/findElementsPageCommands.js');

    const globals = {
      calls: 0,
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 120,
      retryAssertionTimeout: 100,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      output: false,
      skip_testcases_on_fail: false,
      page_objects_path: [path.join(__dirname, '../../../extra/pageobjects/pages')],
      globals
    }));
  });


});
