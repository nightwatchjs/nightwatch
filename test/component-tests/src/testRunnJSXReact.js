const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const {runTests} = common.require('index.js');
const isCI = require('is-ci');

describe('Component Testing -- React JSX component tests', function() {
  it('run a single component test without proper config', async function() {
    const testsPath = path.join(__dirname, '../samples/react/tests/Form.spec--_with-$hooks.jsx');
    const globals = {};

    let error;
    try {
      await runTests({
        source: testsPath,
        headless: true,
        config: path.join(__dirname, '../samples/nightwatch.conf-noplugins.js')
      }, {
        globals,
        output: false,
        silent: false,
        disable_colors: false
      });
    } catch (err) {
      error = err;
    }

    assert.ok(error instanceof SyntaxError);
    assert.ok(error.message.includes('Cannot use import statement outside a module'));
    assert.ok(error.detailedErr.includes('In order to be able to load JSX files, one of these plugins is needed:'));
    assert.ok(error.detailedErr.includes('- @nightwatch/react'));
    assert.ok(error.detailedErr.includes('- @nightwatch/storybook (only if using Storybook in your project)'));
  });

  it.skip('run a single JSX React component test', function() {
    this.retries(2);
    this.timeout(100000);

    const testsPath = path.join(__dirname, '../samples/react/tests/Form.spec--_with-$hooks.jsx');
    const globals = {
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 100,
      retryAssertionTimeout: 150,

      reporter(results) {
        assert.strictEqual(results.passed, 7);
        assert.strictEqual(results.failed, 0);
        assert.strictEqual(results.errors, 0);
      }
    };

    return runTests({
      source: testsPath,
      headless: true,
      debug: false,
      devtools: false,
      config: path.join(__dirname, '../samples/react/nightwatch.conf.js')
    }, {
      globals,
      output: false,
      silent: false,
      disable_colors: false,
      '@nightwatch/react': {
        hooksRetryTimeout: 200,
        hooksRetryInterval: 50
      }
    });
  });

});
