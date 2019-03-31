const assert = require('assert');
const mockery = require('mockery');
const CommandGlobals = require('../../lib/globals/commands.js');

describe('test Assertions', function() {
  before(CommandGlobals.beforeEach);
  after(CommandGlobals.afterEach);

  beforeEach(function() {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
  });

  afterEach(function(done) {
    mockery.deregisterAll();
    mockery.disable();
    done();
  });

  it('Testing assertions loaded', function() {
    var prop;

    for (prop in assert) {
      assert.ok(prop in this.client.api.assert);
    }
    for (prop in assert) {
      assert.ok(prop in this.client.api.verify);
    }
    assert.ok('elementPresent' in this.client.api.assert);
    assert.ok('elementPresent' in this.client.api.verify);

    assert.ok('elementNotPresent' in this.client.api.assert);
    assert.ok('elementNotPresent' in this.client.api.verify);

    assert.ok('containsText' in this.client.api.assert);
    assert.ok('containsText' in this.client.api.verify);

    assert.ok('attributeEquals' in this.client.api.assert);
    assert.ok('attributeEquals' in this.client.api.verify);

    assert.ok('cssClassPresent' in this.client.api.assert);
    assert.ok('cssClassPresent' in this.client.api.verify);

    assert.ok('cssClassNotPresent' in this.client.api.assert);
    assert.ok('cssClassNotPresent' in this.client.api.verify);

    assert.ok('cssProperty' in this.client.api.assert);
    assert.ok('cssProperty' in this.client.api.verify);

    assert.ok('valueContains' in this.client.api.assert);
    assert.ok('valueContains' in this.client.api.verify);

    assert.ok('visible' in this.client.api.assert);
    assert.ok('visible' in this.client.api.verify);

    assert.ok('hidden' in this.client.api.assert);
    assert.ok('hidden' in this.client.api.verify);

    assert.ok('title' in this.client.api.assert);
    assert.ok('title' in this.client.api.verify);
  });

  it('Testing chai expect is loaded', function() {
    assert.equal(typeof this.client.api.expect, 'function');
    assert.equal(typeof this.client.api.expect.element, 'function');

    var element = this.client.api.expect.element('body');
    assert.ok('attribute' in element);
    assert.ok('css' in element);
    assert.ok('enabled' in element);
    assert.ok('present' in element);
    assert.ok('selected' in element);
    assert.ok('text' in element);
    assert.ok('a' in element);
    assert.ok('an' in element);
    assert.ok('value' in element);
    assert.ok('visible' in element);
  });

  it('Testing passed assertion retry', function(done) {
    let reporterCalls = {
      passedNo: 0,
      failedNo: 0,
    };

    const mockReporter = {
      registerPassed(message) {
        reporterCalls.passedNo++;
      },
      logFailedAssertion(error) {
        assert.ok(error instanceof Error);
        assert.equal(error.name, 'AssertionError')
      },
      registerFailed() {
        reporterCalls.failedNo++;
      },
      logAssertResult(test) {
        assert.strictEqual(test.failure, false);
        assert.strictEqual(test.stackTrace, '');
        assert.ok('message' in test);
        assert.ok('fullMsg' in test);
      }
    };

    const AssertionLoaderMock = require('../../lib/mocks/assertionLoader.js');
    let loader = new AssertionLoaderMock('api/assertions/containsText.js', 'containsText', {
      silent: true,
      output: false
    }, mockReporter);

    loader.setApiMethod('getText', function(cssSelector, callback) {
      assert.equal(cssSelector, '.test_element');
      callback({
        value : 'expected text result'
      });
    }).setAddToQueueFn(function({commandName, commandFn, context, args, namespace, stackTrace}) {
      commandFn.apply(context, args);
    }).loadAssertion(function(passed, value, calleeFn, message) {
      assert.equal(passed, true);
      assert.equal(this.assertion.expected, 'text result');
      assert.equal(this.assertion.abortOnFailure, true);
      assert.equal(this.assertion.passed, true);
      assert.ok(this.assertion.message.startsWith('Test message '));
      assert.strictEqual(this.assertion.calleeFn, calleeFn);

      assert.equal(reporterCalls.passedNo, 1, 'Reporter passedNo was not incremented');
      assert.strictEqual(reporterCalls.failedNo, 0);
    }, done);

    loader.client.api.assert.containsText('.test_element', 'text result', 'Test message');
  });

  it('Testing failed assertion retry', function(done) {
    let reporterCalls = {
      passedNo: 0,
      failedNo: 0,
    };

    const mockReporter = {
      registerPassed() {
        reporterCalls.passedNo++;
      },
      logFailedAssertion(error) {
        assert.ok(error instanceof Error);
        assert.equal(error.name, 'NightwatchAssertError');
      },
      registerFailed() {
        reporterCalls.failedNo++;
      },
      logAssertResult(test) {
        assert.ok('fullMsg' in test);
        assert.ok('message' in test);

        let stackTraceSections = test.stackTrace.split('\n');
        assert.ok(/^Test message in (\d+) ms\./.test(test.fullMsg));
        assert.ok(stackTraceSections[1].indexOf('api-loader/testAssertions.js') > -1);
        assert.equal(test.failure, 'Expected "text result" but got: "not_expected"');
      }
    };

    const AssertionLoaderMock = require('../../lib/mocks/assertionLoader.js');
    let loader = new AssertionLoaderMock('api/assertions/containsText.js', 'containsText', {
      silent: true,
      output: false
    }, mockReporter);

    loader.setApiMethod('getText', function(cssSelector, callback) {
      assert.equal(cssSelector, '.test_element');
      callback({
        value : 'not_expected'
      });
    }).setAddToQueueFn(function({commandName, commandFn, context, args, namespace, stackTrace}) {
      commandFn.stackTrace = stackTrace;
      commandFn.apply(context, args);
    }).loadAssertion(function(passed, value, calleeFn, message) {
      assert.equal(passed, false);
      assert.equal(value, 'not_expected');
      assert.equal(this.assertion.actual, 'not_expected');
      assert.equal(this.assertion.passed, false);
      assert.equal(this.assertion.expected, 'text result');
      assert.equal(this.retries, 1);
      assert.equal(this.opts.timeout, 5);
      assert.equal(this.opts.rescheduleInterval, 10);
      assert.ok(this.assertion.message.startsWith('Test message in'));

      assert.equal(reporterCalls.passedNo, 0);
      assert.strictEqual(reporterCalls.failedNo, 1);
    }, done);

    loader.client.api.assert.containsText('.test_element', 'text result', 'Test message');
  });

});
