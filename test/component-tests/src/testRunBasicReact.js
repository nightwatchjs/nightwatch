const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const {runTests} = common.require('index.js');

describe('Component Testing -- React basic component mount tests', function() {
  it('run a single component test without proper config', function() {
    const testsPath = path.join(__dirname, '../samples/react/tests/formTest.js');

    const globals = {
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 100,
      retryAssertionTimeout: 150,

      reporter(results) {
        assert.ok(results.lastError instanceof TypeError);
        assert.strictEqual(results.lastError.link, 'https://nightwatchjs.org/guide/concepts/component-testing.html');
        assert.strictEqual(results.lastError.detailedErr, '  - writing a component test? - make sure to install the necessary plugins (e.g. @nightwatch/react or @nightwatch/vue)');
      }
    };

    return runTests({
      source: testsPath,
      headless: true,
      config: path.join(__dirname, '../samples/nightwatch.conf-noplugins.js')
    }, {
      globals,
      output: false,
      silent: false,
      disable_colors: false
    });
  });

  xit('run a single React component test with missing component', function() {
    this.timeout(10000);

    const testsPath = path.join(__dirname, '../samples/react/tests/formTest--notFound.js');

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
      config: path.join(__dirname, '../samples/react/nightwatch.conf.js')
    }, {
      globals,
      output: false,
      silent: true,
      disable_colors: false,
      '@nightwatch/react': {
        hooksRetryTimeout: 200,
        hooksRetryInterval: 50
      }
    });
  });

  it('run a single React component test', function() {
    this.timeout(100000);

    const testsPath = path.join(__dirname, '../samples/react/tests/formTest.js');

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
      devtools: true,
      config: path.join(__dirname, '../samples/react/nightwatch.conf.js')
    }, {
      globals,
      output: false,
      silent: false,
      disable_colors: false,
      '@nightwatch/react': {
        hooksRetryTimeout: 1000,
        hooksRetryInterval: 100
      }
    });
  });
});
