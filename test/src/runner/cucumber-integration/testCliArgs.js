const assert = require('assert');
const path = require('path');
const mockery = require('mockery');
const common = require('../../../common.js');
const CucumberRunner = common.require('runner/test-runners/cucumber.js');

describe('Cucumber cli arguments', function(){
  let cliArgs;

  before(function() {
    mockery.enable();
    mockery.registerMock('@cucumber/cucumber/lib/cli/index', {
      default: class CucumberCli {
        constructor({argv, cwd, stdout}) {
          cliArgs = argv;
        }
      }
    });
  });

  after(function(){
    mockery.deregisterAll();
    mockery.disable();
  });

  it('Cucumber cli args --require-modules', function(){
    const runner =  new CucumberRunner({test_runner: {
      type: 'cucumber',
      options: {}
    }}, {'require-module': ['coffeescript/register', 'ts-node/register']});

    runner.createTestSuite({
      modules: [
        path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')
      ],
      modulePath: [
        path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')
      ]
    });

    assert.ok(cliArgs.includes('--require-module'));
    let index = cliArgs.indexOf('--require-module') + 1;

    assert.strictEqual(cliArgs[index], 'coffeescript/register');
    index =  cliArgs.indexOf('--require-module', index)+1;
    assert.strictEqual(cliArgs[index], 'ts-node/register');
  });

  it('Cucumber cli args', function(){
    const runner =  new CucumberRunner({test_runner: {
      type: 'cucumber',
      options: {}
    }}, {'no-strict': true, retries: 2, profile: 'local', 'fail-fast': true, parallel: 3, name: 'sample', 'retry-tag-filter': '@nightwatch'}, {});

    runner.createTestSuite({
      modules: [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')],
      modulePath: [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')]
    });

    assert.strictEqual(cliArgs.length, 21);
    assert.ok(cliArgs.includes('--name'));
    assert.strictEqual(cliArgs[cliArgs.indexOf('--name')+1], 'sample');
    assert.ok(cliArgs.includes('--fail-fast'));
    assert.ok(cliArgs.includes('--retry'));
    assert.strictEqual(cliArgs[cliArgs.indexOf('--retry')+1], 2);
    assert.ok(cliArgs.includes('--retry-tag-filter'));
    assert.strictEqual(cliArgs[cliArgs.indexOf('--retry-tag-filter')+1], '@nightwatch');
    assert.ok(cliArgs.includes('--profile'));
    assert.strictEqual(cliArgs[cliArgs.indexOf('--profile')+1], 'local');
    assert.ok(cliArgs.includes('--no-strict'));
    assert.ok(cliArgs.includes('--parallel'));
    assert.strictEqual(cliArgs[cliArgs.indexOf('--parallel')+1], 3);
  });

  it('Cucumber cli arg --dry-run', function(){
    const runner = new CucumberRunner({
      test_runner: {
        type: 'cucumber',
        options: {}
      }
    }, {
      'dry-run': true
    }, {});

    runner.createTestSuite({
      modules: [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')],
      modulePath: [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')]
    });

    assert.ok(cliArgs.includes('--dry-run'));
  });

  it('Cucumbr additional option --retries', function(){
    const runner = new CucumberRunner({
      test_runner: {
        type: 'cucumber',
        options: {
          retries: 3
        }
      }
    }, {}, {});

    runner.createTestSuite({
      modules: [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')],
      modulePath: [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')]
    });

    assert.ok(cliArgs.includes('--retry'));
  });

  it('Cucumbr additional options --retry and --format', function(){
    const runner = new CucumberRunner({
      test_runner: {
        type: 'cucumber',
        options: {
          retries: 3,
          format: '@cucumber/pretty-formatter'
        }
      }
    }, {}, {});

    runner.createTestSuite({
      modules: [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')],
      modulePath: [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')]
    });

    assert.ok(cliArgs.includes('--retry'));
    assert.ok(cliArgs.includes('--format'));
    assert.strictEqual(cliArgs[cliArgs.indexOf('--retry')+1], 3);
    assert.strictEqual(cliArgs[cliArgs.indexOf('--format')+1], '@cucumber/pretty-formatter');
  });
});
