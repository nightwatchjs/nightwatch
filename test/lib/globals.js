const fs = require('fs');
const path = require('path');
const assert = require('assert');
const lodashMerge = require('lodash.merge');
const common = require('../common.js');
const Settings = common.require('settings/settings.js');
const Runner = common.require('runner/runner.js');
const Reporter = common.require('reporter/index.js');
const FakeDriver = require('./fakedriver.js');
const Nightwatch = require('../lib/nightwatch.js');
const MockServer  = require('../lib/mockserver.js');

class ExtendedReporter extends Reporter {
  registerPassed(message) {
    this.assertionMessage = message;

    super.registerPassed(message);
  }

  logAssertResult(result) {
    this.assertionResult = result;

    super.logAssertResult(result);
  }
}

class Globals {
  runGroupGlobal(client, hookName, done) {
    const groupGlobal = path.join(__dirname, './globals/', client.currentTest.group.toLowerCase() + '.js');

    fs.stat(groupGlobal, function(err, stats) {
      if (err) {
        return done();
      }

      const global = require(groupGlobal);

      if (global[hookName]) {
        global[hookName].call(global, done);
      } else {
        done();
      }
    });
  }

  beforeEach(client, done) {
    if (client.currentTest.group) {
      this.runGroupGlobal(client, 'beforeEach', done);
    } else {
      done();
    }
  }

  afterEach(client, done) {
    if (client.currentTest.group) {
      this.runGroupGlobal(client, 'afterEach', done);
    } else {
      done();
    }
  }

  protocolAfter(done) {
    if (this.client) {
      this.client = null;
    }
    if (this.wdClient) {
      this.wdClient = null;
    }

    if (this.server) {
      this.server.close(() => done());
    } else {
      done();
    }
  }

  async protocolBefore(opts = {}, done) {
    this.client = await Nightwatch.createClient(opts).initialize();

    this.wdClient = await Nightwatch.createClient({
      selenium: {
        version2: false,
        start_process: false
      },
      webdriver: {
        start_process: true
      }
    }).initialize();

    this.client.sessionId = this.client.api.sessionId = '1352110219202';
    this.wdClient.sessionId = this.wdClient.api.sessionId = '1352110219202';

    if (typeof done == 'function') {
      this.server = MockServer.init();
      this.server.on('listening', () => done());
    }
  }

  protocolTest(definition) {
    return this.runProtocolTest(definition, this.client);
  }

  protocolTestWebdriver(definition) {
    return this.runProtocolTest(definition, this.wdClient);
  }

  runProtocolTest({assertion = function() {}, commandName, args = [], mockDriverOverrides = {}, browserDriver = ''}, client) {
    return new Promise((resolve, reject) => {
      client.transport.runProtocolAction = function(opts) {
        assertion(opts);
      };

      client.elementLocator.sendElementsAction = function({transportAction, args}) {
        //assertion(opts);
        return this.transport.executeProtocolAction(transportAction, args);
      };

      let driver;

      if (browserDriver === 'chrome') {
        driver = FakeDriver.createChromeDriver(assertion, mockDriverOverrides);
      } else if (browserDriver === 'firefox') {
        driver = FakeDriver.createFirefoxDriver(assertion, mockDriverOverrides);
      } else {
        driver = FakeDriver.create(assertion, mockDriverOverrides, args);
      }

      client.transport.driver = driver;

      if (args[0] === '@seleniumElement') {
        args[0] = FakeDriver.fakeSeleniumElement(client.transport.driver, '12345-6789');
      }

      client.queue.tree.empty().createRootNode();
      client.queue.once('queue:finished', err => {
        if (err) {
          reject(err);
        }
      });

      client.isES6AsyncTestcase = true;

      try {
        this.runApiCommand(commandName, args, client)
          .then(result => {
            if (result instanceof Error) {
              reject(result);
            } else {
              resolve(result);
            }
          })
          .catch(err => {
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  runApiCommand(commandName, args, client = this.client) {
    let context;
    let commandFn;
    const namespace = commandName.split('.');

    if (namespace.length === 1) {
      context = client.api;
      commandFn = context[commandName];
    } else {
      context = client.api[namespace[0]];
      if (namespace[2]) {
        context = context[namespace[1]];
        commandFn = context[namespace[2]];
      } else {
        commandFn = context[namespace[1]];
      }
    }

    return commandFn.apply(client.api, args);
  }

  startTestRunner(testsPath, suppliedSettings) {
    let settings = Settings.parse(suppliedSettings);
    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    if (!Array.isArray(testsPath)) {
      testsPath = [testsPath];
    }

    return Runner
      .readTestSource(settings, {
        _source: testsPath
      })
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        return runner;
      });
  }

  createReporter() {
    const reporter = new ExtendedReporter({
      settings: this.client.settings
    });

    this.client.setReporter(reporter);
  }
}

module.exports = new Globals();
function addSettings(settings) {
  return lodashMerge({
    globals: {
      retryAssertionTimeout: 5,
      waitForConditionPollInterval: 3
    },
    output: false,
    silent: false
  }, settings);
}

module.exports.assertion = async function(assertionName, api, {
  args = [],
  commandResult = {},
  assertArgs = false,
  assertError = false,
  assertMessage = false,
  assertFailure = false,
  assertResult = false,
  negate = false,
  assertApiCommandArgs,
  assertion = function() {},
  settings = {}
}) {
  const instance = new Globals();
  const options = addSettings(settings);
  await instance.protocolBefore(options);

  return new Promise((resolve, reject) => {
    // initialize
    const onFinish = function(err) {
      instance.protocolAfter(() => {
        if (err) {
          reject(err);

          return;
        }

        resolve();
      });
    };

    let context;
    let queueOpts;

    // add API command
    if (api) {
      instance.client.api[api] = function(...fnArgs) {
        if (assertArgs) {
          if (typeof args[0] == 'string') {
            assert.deepStrictEqual(fnArgs[0], {
              selector: args[0],
              suppressNotFoundErrors: true
            });
          } else {
            assert.deepStrictEqual(fnArgs[0], args[0]);
          }

          if (fnArgs.length > 2) {
            assert.strictEqual(fnArgs[1], args[1]);
          }
        } else if (assertApiCommandArgs) {
          assertApiCommandArgs(fnArgs);
        }

        const callback = fnArgs[fnArgs.length - 1];
        callback(typeof commandResult == 'function' ? commandResult() : commandResult);
      };
    }

    // intercept add to queue and store the context and options
    const {client} = instance;
    const addToQueue = client.queue.add;
    client.queue.add = function(opts) {
      context = opts.context;
      queueOpts = opts.options;
      addToQueue.call(this, opts);
    };

    client.queue.done = function(err) {
      this.emit('queue:finished', err);
    };

    // create an extended reporter so we can intercept the results
    instance.createReporter();

    // when the queue has finished running, signal the end of the test
    client.queue.once('queue:finished', err => {
      if (err && err.name !== 'NightwatchAssertError') {
        onFinish(err);

        return;
      }

      try {
        // Run common assertions
        if (assertError) {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.name, 'NightwatchAssertError');
        }

        const assertionInstance = context.instance;
        const {reporter} = client;

        if (assertArgs) {
          assert.deepStrictEqual(assertionInstance.args, args);
          assert.deepStrictEqual(assertionInstance.retryAssertionTimeout, undefined);
          assert.deepStrictEqual(assertionInstance.rescheduleInterval, undefined);
        }

        if (assertFailure) {
          assert.strictEqual(assertionInstance.hasFailure(), true);
          assert.strictEqual(assertionInstance.isOk(assertionInstance.getValue()), false);
        }

        if (assertMessage) {
          const message = args[args.length - 1];
          assert.strictEqual(assertionInstance.message, message);
          assert.ok(typeof reporter.assertionMessage != 'undefined', 'assertionMessage is undefined');
          assert.ok(reporter.assertionMessage.startsWith(message), reporter.assertionMessage);
        }

        if (assertResult) {
          assert.deepStrictEqual(assertionInstance.result, commandResult);
        }

        const {failure, message} = client.reporter.assertionResult;
        assertion({reporter, instance: assertionInstance, err, queueOpts, failure, message});

        onFinish();
      } catch (ex) {
        onFinish(ex);
      }
    });

    // run the assertion
    const negateStr = negate ? 'not.' : '';
    instance.runApiCommand(`assert.${negateStr}${assertionName}`, args);
  });

};
