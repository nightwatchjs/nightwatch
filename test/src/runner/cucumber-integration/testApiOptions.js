const assert = require('assert');
const path = require('path');
const mockery = require('mockery');
const common = require('../../../common.js');
const CucumberRunner = common.require('runner/test-runners/cucumber.js');

describe('Cucumber api options', function(){
  before(function() {
    mockery.enable();
    mockery.registerMock('@cucumber/cucumber', {
      version: '11.0.0'
    });
    mockery.registerMock('@cucumber/cucumber/api', {});
  });

  after(function(){
    mockery.deregisterAll();
    mockery.disable();
  });

  it('Cucumber api options', function(){
    const runner =  new CucumberRunner({test_runner: {
      type: 'cucumber',
      options: {
        integrationStrategy: 'API'
      }
    }}, {'no-strict': true, retries: 2, profile: 'local', 'fail-fast': true, parallel: 3, name: 'sample', 'retry-tag-filter': '@nightwatch'}, {});

    const suite = runner.createTestSuite({
      modules: [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')],
      modulePath: [path.join(__dirname, '../../../cucumber-integration-tests/sample_cucumber_tests/integration/testSample.js')]
    });
    
    assert.deepStrictEqual(suite.cucumberOptions.profiles, ['local']);
    const providedArgs = suite.cucumberOptions.provided;
    assert.strictEqual(providedArgs.length, 18);
    assert.ok(providedArgs.includes('--name'));
    assert.strictEqual(providedArgs[providedArgs.indexOf('--name') + 1], 'sample');
    assert.ok(providedArgs.includes('--fail-fast'));
    assert.ok(providedArgs.includes('--retry'));
    assert.strictEqual(providedArgs[providedArgs.indexOf('--retry') + 1], 2);
    assert.ok(providedArgs.includes('--retry-tag-filter'));
    assert.strictEqual(providedArgs[providedArgs.indexOf('--retry-tag-filter') + 1], '@nightwatch');
    assert.ok(providedArgs.includes('--profile'));
    assert.strictEqual(providedArgs[providedArgs.indexOf('--profile') + 1], 'local');
    assert.ok(providedArgs.includes('--no-strict'));
    assert.ok(providedArgs.includes('--parallel'));
    assert.strictEqual(providedArgs[providedArgs.indexOf('--parallel') + 1], 3);
    assert.ok(providedArgs.includes('--world-parameters'));
    assert.ok(JSON.parse(providedArgs[providedArgs.indexOf('--world-parameters') + 1]));
    assert.ok(providedArgs.includes('--require'));
  });
});