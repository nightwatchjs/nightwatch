const assert = require('assert');
const path = require('path');
const CommandGlobals = require('../../lib/globals/commands-w3c.js');
const common = require('../../common.js');
const {runTests} = common.require('index.js');
const {settings} = common;

describe('element().isPresent() command', function() {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test runner with multiple test interfaces - exports/describe', function () {
    const srcFolders = [
      path.join(__dirname, '../../sampletests/withdescribe/basic2')
    ];

    const globals = {
      asynctreeFinishedEventCount: 0,
      queueFinishedEventCount: 0,
      reporter(results, cb) {
        if (results.lastError) {
          throw results.lastError;
        }

        // should equal the number of test cases.
        assert.equal(globals.asynctreeFinishedEventCount, 3);

        // only counts for the first test case + afterEach
        assert.equal(globals.queueFinishedEventCount, 2);

        cb();
      }
    };

    return runTests(settings({
      globals,
      src_folders: srcFolders,
      output: true,
      silent: false
    }));
  });
});
