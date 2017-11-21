const assert = require('assert');
const mockery = require('mockery');
const common = require('../../common.js');
const Globals = require('../../lib/globals/expect.js');
const nock = require('nock');

module.exports = {
  'test Assertions' : {
    beforeEach(done) {
      Globals.beforeEach.call(this, {
        silent: true,
        output: false
      }, function() {
        mockery.enable({useCleanCache: true, warnOnUnregistered: false});
        done();
      });
    },

    afterEach() {
      mockery.deregisterAll();
      mockery.disable();
      Globals.afterEach.call(this);
    },
    /*
        'Testing results module on failure' : function(done) {
          nock('http://localhost:10195')
            .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
            .reply(200, {
              status: 0,
              value: []
            });


          this.client.api.assert.elementPresent('#weblogin');

          this.client.once('nightwatch:session.finished', function(results, errors) {
            assert.equal(results.passed, 0);
            assert.equal(results.failed, 1);
            assert.equal(results.errors, 0);
            assert.equal(results.skipped, 0);
            assert.equal(results.tests[0].message, 'Testing if element <#weblogin> is present.');
            assert.equal(results.tests[0].failure, 'Expected "present" but got: "not present"');
            assert.ok('stackTrace' in results.tests[0]);
            done();
          });

          this.client.startSession();
        },

            'Testing results module on pass' : function(done) {
              nock('http://localhost:10195')
                .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
                .reply(200, {
                  status: 0,
                  state: 'success',
                  value: [{ ELEMENT: '0' }]
                });

              this.client.api.assert.elementPresent('#weblogin');
              this.client.once('nightwatch:finished', function(results, errors) {
                assert.equal(results.passed, 1);
                assert.equal(results.failed, 0);
                assert.equal(results.errors, 0);
                assert.equal(results.skipped, 0);
                assert.equal(results.tests[0].message, 'Testing if element <#weblogin> is present.');
                assert.equal(results.tests[0].failure, false);
                assert.equal(results.tests[0].stackTrace, '');
                done();
              });
              this.client.start();
            },
        */
    'Testing assertions loaded' : function() {
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

    },
/*
    'Testing chai expect is loaded' : function() {
      assert.equal(typeof this.client.api.expect, 'function');
      assert.equal(typeof this.client.api.expect.element, 'function');

      var something = 'test';
      var expect = this.client.api.expect(something);
      assert.deepEqual(expect, require('chai').expect(something));

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

    },
*/
    'Testing passed assertion retry' : function(done) {
      let reporterCalls = {
        passedNo: 0,
        failedNo: 0,
      };

      mockery.registerMock('../util/logger.js', {
        colors: {
          green(symbol) {
            assert.ok(symbol === String.fromCharCode(10004));
            return '';
          }
        },
        logDetailedMessage(message) {}
      });

      mockery.registerMock('../core/reporter.js', {
        incrementPassedNo() {
          reporterCalls.passedNo++;
        },
        setLastError(error) {

        },
        incrementFailedNo() {
          reporterCalls.failedNo++;
        },
        addTestToResults(test) {
          assert.strictEqual(test.failure, false);
          assert.strictEqual(test.stackTrace, '');
          assert.ok('message' in test);
          assert.ok('fullMsg' in test);
        }
      });

      let loader = createAssertionLoader('expected text result', function(passed, value, calleeFn, message) {
        assert.equal(passed, true);
        assert.equal(this.assertion.expected, 'text result');
        assert.equal(this.assertion.abortOnFailure, true);
        assert.equal(this.assertion.passed, true);
        assert.ok(this.assertion.message.startsWith('Test message after'));
        assert.strictEqual(this.assertion.calleeFn, calleeFn);
        assert.ok(this.assertion.stackTraceTitle.indexOf('Test message after') > -1);

        assert.equal(reporterCalls.passedNo, 1, 'Reporter passedNo was not incremented');
        assert.strictEqual(reporterCalls.failedNo, 0);
        done();
      });

      loader.commandFn('.test_element', 'text result', 'Test message');
    },

    'Testing failed assertion retry' : function(done) {
      let reporterCalls = {
        passedNo: 0,
        failedNo: 0,
      };
      let loggerCalls = {
        detailedMessage: 0
      };

      mockery.registerMock('../util/logger.js', {
        colors: {
          green(s) {
            return s;
          },
          red(a) {
            return a;
          },
          stack_trace(a) {
            return a;
          }
        },
        logDetailedMessage(message) {
          if (loggerCalls.detailedMessage === 0) {
            assert.ok(/^\s*✖ Test message after (\d+) milliseconds\. - expected "text result" but got: "not_expected"$/.test(message));
          } else {
            assert.ok(/^\s*AssertionError: Test message after (\d+) milliseconds\./.test(message));
          }

          loggerCalls.detailedMessage++;
        }
      });

      mockery.registerMock('../core/reporter.js', {
        incrementPassedNo() {
          reporterCalls.passedNo++;
        },
        setLastError(error) {
          assert.ok(error instanceof Error);
          assert.equal(error.name, 'AssertionError')
        },
        incrementFailedNo() {
          reporterCalls.failedNo++;
        },
        addTestToResults(test) {
          let stackTraceSections = test.stackTrace.split('\n');
          assert.ok(/^AssertionError: Test message after (\d+) milliseconds\.$/.test(stackTraceSections[0]));
          assert.ok(stackTraceSections[1].indexOf('api-loader/testAssertions.js') > -1);
          assert.equal(test.failure, 'Expected "text result" but got: "not_expected"');
          assert.ok('message' in test);
          assert.ok('fullMsg' in test);
        }
      });

      let loader = createAssertionLoader('not_expected', function(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, 'not_expected');
        assert.equal(this.assertion.actual, 'not_expected');
        assert.equal(this.assertion.passed, false);
        assert.equal(this.assertion.expected, 'text result');
        assert.equal(this.retries, 1);
        assert.equal(this.timeout, 5);
        assert.equal(this.rescheduleInterval, 10);
        assert.ok(this.assertion.message.startsWith('Test message after'));

        assert.equal(reporterCalls.passedNo, 0);
        assert.strictEqual(reporterCalls.failedNo, 1);
        done();
      });

      loader.commandFn('.test_element', 'text result', 'Test message');
    }

  }
};

function createAssertionLoader(returnValue, assertCallback) {
  //const NightwatchAssertion = common.requireMock('core/assertion.js', assertCallback);
  //mockery.registerMock('../core/assertion.js', NightwatchAssertion);

  const assertionModule = common.require('api/assertions/containsText.js');
  let mockClient = {
    options: {
      silent: true,
      output: false
    },
    api : {
      assert: {},
      globals: {
        retryAssertionTimeout: 5,
        waitForConditionPollInterval: 10
      },
      getText : function(cssSelector, callback) {
        assert.equal(cssSelector, '.test_element');
        callback({
          value : returnValue
        });
      }
    },
    isApiMethodDefined: function(commandName, namespace) {
      return false;
    },
    setApiMethod: function(commandName, namespace, commandFn) {
      mockClient.api[namespace][commandName] = function() {
      };
    }
  };

  const AssertionLoader = common.requireMock('api-loader/assertion.js', 'containsText', assertionModule, assertCallback);
  let loader = new AssertionLoader(mockClient);
  loader.loadModule()
    .setNamespace('assert')
    .createWrapper(true)
    .define();

  return loader;
}