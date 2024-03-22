const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const {runTests} = common.require('index.js');

describe('Component Testing -- Vue basic component mount tests', function() {
  xit('run a single Vue component test with missing component', function() {
    this.timeout(100000);

    const testsPath = path.join(__dirname, '../samples/vue/tests/formTest--notFound.js');

    const globals = {
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 100,
      retryAssertionTimeout: 150,

      reporter(results) {
        assert.strictEqual(results.errors, 1);
        assert.strictEqual(results.failed, 0);
        assert.strictEqual(results.passed, 0);
        assert.ok(results.lastError instanceof Error);
        assert.strictEqual(results.lastError.name, 'NightwatchMountError');
        assert.strictEqual(results.lastError.message, 'time out reached (200ms) while waiting for component to mount.');
        assert.deepStrictEqual(results.lastError.help, [
          'run nightwatch with --devtools and --debug flags (Chrome only)',
          'investigate the error in the browser console'
        ]);
      }
    };

    return runTests({
      source: testsPath,
      headless: true,
      devtools: false,
      debug: false,
      config: path.join(__dirname, '../samples/vue/nightwatch.conf.js')
    }, {
      globals,
      output: false,
      silent: true,
      disable_colors: false,
      '@nightwatch/vue': {
        hooksRetryTimeout: 200,
        hooksRetryInterval: 50
      }
    });
  });

  it('run a single vue component test', function() {
    this.timeout(100000);

    const testsPath = path.join(__dirname, '../samples/vue/tests/formTest.js');

    const globals = {
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 100,
      retryAssertionTimeout: 150,

      reporter(results) {
        assert.strictEqual(results.errors, 0);
        assert.strictEqual(results.failed, 0);
        assert.strictEqual(results.passed, 1);
      }
    };

    return runTests({
      source: testsPath,
      headless: true,
      debug: false,
      devtools: false,
      config: path.join(__dirname, '../samples/vue/nightwatch.conf.js')
    }, {
      globals,
      output: false,
      silent: false,
      disable_colors: false,
      '@nightwatch/vue': {
        hooksRetryTimeout: 1000,
        hooksRetryInterval: 100
      }
    });
  });
});
