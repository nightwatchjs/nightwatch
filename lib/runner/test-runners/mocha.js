const path = require('path');
const Nightwatch = require('../../index.js');
const Concurrency = require('../concurrency');
const Utils = require('../../utils');
const {Logger} = Utils;
const TestSuite = require('../../testsuite');

const customRunnable = async function(fn, isHook = false) {
  let self = this;
  let start = new Date();
  let ctx = this.ctx;
  let finished;

  if (this.isPending()) {
    return fn();
  }

  let emitted;
  if (!isHook) {
    this._enableTimeouts = false;
  }

  // Sometimes the ctx exists, but it is not runnable
  if (ctx && ctx.runnable) {
    ctx.runnable(this);
  }

  // called multiple times
  function multiple(err) {
    if (emitted) {
      return;
    }
    emitted = true;
    let msg = 'done() called multiple times';
    if (err && err.message) {
      err.message += ` (and Mocha's ${msg})`;
      self.emit('error', err);
    } else {
      self.emit('error', new Error(msg));
    }
  }

  // finished
  function done(err) {
    let ms = self.timeout();
    if (self.timedOut) {
      return;
    }

    if (finished) {
      return multiple(err);
    }

    self.clearTimeout();
    self.duration = new Date() - start;
    finished = true;
    if (!err && self.duration > ms && self._enableTimeouts) {
      err = new Error('Timeout of ' + ms +
        'ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.');
    }
    fn(err);
  }

  this.callback = done;

  this.resetTimeout();
  try {
    const args = [this.parent.client.api];
    let userCalled = false;

    const onFinished = function(err) {
      if (err instanceof Error) {
        return done(err);
      }

      if (err) {
        if (Object.prototype.toString.call(err) === '[object Object]') {
          return done(new Error('done() invoked with non-Error: ' +
            JSON.stringify(err)));
        }

        return done(new Error('done() invoked with non-Error: ' + err));
      }

      done();
    };

    const {nightwatchSuite} = this.parent;
    //await nightwatchSuite.createSession();

    const err = await nightwatchSuite.handleRunnable(this.title, () => {
      if (isHook && this.async === 2) {
        return new Promise((resolve, reject) => {
          args.push(function(err) {
            userCalled = true;

            setTimeout(function() {
              if (err instanceof Error) {
                reject(err);
              } else {
                resolve();
              }
              onFinished(err);
            }, 10);
          });

          this.fn.apply(ctx, args);
        });
      }

      const result = this.fn.apply(ctx, args);

      if (result instanceof Promise) {
        return result;
      }
    });

    if (this.async <= 1) {
      done(err);
      emitted = true;
    }
  } catch (err) {
    done(err);
    emitted = true;
  }
};

class Extensions {
  static createClient(settings) {
    return Nightwatch.client(settings);
  }

  static __adaptRunnables(parent) {
    Extensions.__adaptHooks(parent, ['_afterAll', '_afterEach', '_beforeAll', '_beforeEach']);
    parent.tests = parent.tests.map(function(test) {
      test.run = function(...args) {
        // eslint-disable-next-line no-console
        console.log(`\n  Running ${Logger.colors.green(this.title)}${Logger.colors.stack_trace('...')}`);

        this.parent.client.isES6AsyncTestcase = Utils.isES6AsyncFn(this.fn);
        delete this.parent.client.isES6AsyncTestHook;

        return customRunnable.apply(this, args);
      }.bind(test);

      return test;
    });

    if (parent.suites && parent.suites.length > 0) {
      parent.suites.forEach(function(item) {
        Extensions.__adaptRunnables(item);
      });
    }

  }

  static __adaptHooks(suite, hooks) {
    hooks.forEach(function(hook) {
      suite[hook].forEach(hookInstance => {
        const originalRunFn = hookInstance.run;
        hookInstance.run = function(fn) {
          const isAsync = Utils.isES6AsyncFn(this.fn);
          //console.log(`  Running ${Logger.colors.stack_trace(this.title + ':')}`);
          this.parent.client.isES6AsyncTestcase = isAsync;

          if (this.fn.length === 0 && isAsync) {
            return originalRunFn.call(this, fn);
          }

          return customRunnable.call(this, fn, true);
        }.bind(hookInstance);
      });
    });
  }
}

class MochaRunner {
  static MochaNightwatch({argv, settings, addtOpts}) {
    const Mocha = require('mocha');

    const createNightwatchSuite = ({suite, modules = [], settings, argv, addtOpts}) => {
      const nightwatchSuite = new TestSuite({
        modules,
        settings,
        argv,
        usingMocha: true,
        addtOpts,
        modulePath: null
      });

      nightwatchSuite.initCommon({
        suiteTitle: suite.title
      });

      return nightwatchSuite;
    };

    const augmentTestSuite = function({suite, runner}) {
      const timeoutFn = suite.timeout;

      const attributes = [
        'tags',
        'desiredCapabilities',
        'endSessionOnFail',
        'skipTestcasesOnFail',
        'unitTest'
      ];

      Object.defineProperties(suite, attributes.reduce((prev, attribute) => {
        prev[attribute] = {
          configurable: true,
          set: function(value) {
            this.nightwatchSuite.context.setAttribute(`@${attribute}`, value);
          },

          get: function() {
            if (!this.nightwatchSuite) {
              return null;
            }

            return this.nightwatchSuite.context.getAttribute(`@${attribute}`);
          }
        };

        return prev;
      }, {}));

      const nightwatchSuite = createNightwatchSuite({
        suite,
        settings,
        argv,
        addtOpts
      });

      Object.defineProperties(suite, {
        nightwatchSuite: {
          configurable: true,
          get: function() {
            return nightwatchSuite;
          }
        },

        client: {
          configurable: true,
          get: function() {
            return nightwatchSuite.client;
          }
        },

        isWorker: {
          configurable: true,
          get: function() {
            return runner.isWorker;
          }
        },

        files: {
          configurable: true,
          get: function() {
            return runner.files;
          }
        },

        mochaOptions: {
          configurable: true,
          get: function() {
            return runner.options;
          }
        }
      });

      Object.defineProperties(suite, {
        globals: {
          get: function() {
            return this.nightwatchSuite.settings.globals;
          }
        },

        settings: {
          get: function() {
            return this.nightwatchSuite.settings;
          }
        },

        argv: {
          get: function() {
            return this.nightwatchSuite.argv;
          }
        },

        suiteRetries: {
          value: function(value) {
            if (typeof value != 'undefined') {
              this.nightwatchSuite.context.setSuiteRetries(value);
            }
          }
        },

        waitForTimeout: {
          value: function(value) {
            if (typeof value == 'undefined') {
              return this.globals.waitForConditionTimeout;
            }
            this.globals.waitForConditionTimeout = value;
            this.globals.retryAssertionTimeout = value;
          }
        },

        timeout: {
          value: function(value) {
            if (typeof value == 'undefined') {
              return timeoutFn.call(this);
            }

            this.globals.unitTestsTimeout = value;

            timeoutFn.call(this, value);
          }
        },

        waitForRetryInterval: {
          value: function(value) {
            if (typeof value == 'undefined') {
              return this.globals.waitForConditionPollInterval;
            }

            this.globals.waitForConditionPollInterval = value;
          }
        }
      });

      if (Utils.isUndefined(suite.timeout())) {
        suite.timeout(20000);
      }
    };

    class CustomRunner extends Mocha.Runner {
      async runSuite(suite, fn) {
        const isMainSuite = suite.parent && suite.parent.root;
        const createSession = () => {
          return new Promise(function(resolve, reject) {
            if (isMainSuite) {
              try {
                if (suite.file) {
                  suite.nightwatchSuite.setModulePath(suite.file);
                }

                suite.nightwatchSuite.startTestSuite()
                  .then(data => resolve(data))
                  .catch(err => reject(err));
              } catch (err) {
                reject(err);
              }
            } else {
              if (!suite.root && suite.parent.nightwatchSuite) {
                suite.nightwatchSuite.createClient(suite.parent.nightwatchSuite.client);
                suite.nightwatchSuite.reporter = suite.parent.nightwatchSuite.reporter;
              }
              resolve(false);
            }
          });
        };

        const onSuiteFinished = (err) => {
          if (!suite.nightwatchSuite) {
            return fn(err);
          }

          suite.nightwatchSuite.onTestSuiteFinished().then(failures => {
            fn(err);
          }).catch(suiteError => {
            console.error(suiteError);
            suiteError = suiteError || err;
            fn(suiteError);
          });
        };

        try {
          // create the nightwatch session
          const sessionInfo = await createSession();
        } catch (err) {
          // an error occurred while trying to create the session
          this.failures = err;

          return onSuiteFinished(err);
        }

        // run the mocha suite
        return super.runSuite(suite, onSuiteFinished);
      }

      run(fn) {
        Extensions.__adaptRunnables(this.suite);

        super.run(fn);
      }
    }

    return class MochaNightwatch extends Mocha {
      constructor(mochaOpts, nightwatchSettings) {
        super(mochaOpts);
        this.nightwatchSettings = nightwatchSettings;
        this._runnerClass = CustomRunner;

        const runner = this;

        this.suite.on('suite', suite => {
          suite.on('suite', childSuite => {
            augmentTestSuite({suite: childSuite, runner});
          });

          augmentTestSuite({suite, runner});
        });
      }
    };
  }

  get supportsConcurrency() {
    return true;
  }

  get combinedReporterList() {
    return ['mochawesome'];
  }

  get type() {
    return 'mocha';
  }

  constructor(settings, argv, addtOpts = {}) {
    this.startTime = new Date().getTime();
    this.settings = settings;
    this.argvOpts = argv;
    this.publishReport = false;
    this.argv = argv;
    this.processListener = addtOpts.processListener;

    this.mochaOpts = settings.test_runner.options || {};
    if (Utils.isUndefined(this.mochaOpts.timeout)) {
      this.mochaOpts.timeout = settings.globals.asyncHookTimeout;
    }

    if (argv.reporter && argv.reporter !== 'junit') {
      this.mochaOpts.reporter = argv.reporter;
    }

    if (argv.grep) {
      this.mochaOpts.grep = argv.grep;
    }

    if (argv.retries) {
      this.mochaOpts.retries = argv.retries;
    }

    if (argv.fgrep) {
      this.mochaOpts.fgrep = argv.fgrep;
    }

    if (argv.invert) {
      this.mochaOpts.invert = argv.invert;
    }

    this.mochaOpts.reporterOptions = this.mochaOpts.reporterOptions || {};

    if (argv.reporter === 'mocha-junit-reporter') {
      this.mochaOpts.reporterOptions.mochaFile = path.join(settings.output_folder, 'test-results.xml');
    }

    if (this.isTestWorker()) {
      const filePath = this.argv.test;
      const reportFilename = filePath.substring(filePath.lastIndexOf('/')+1).split('.')[0];
      this.mochaOpts.isWorker = true;

      switch (argv.reporter) {
        case 'mocha-junit-reporter':
        case 'mochawesome':
          this.mochaOpts.reporterOptions.mochaFile = path.join(settings.output_folder, `${reportFilename}.xml`);
          break;
      }

      if (argv.reporter === 'mochawesome') {
        this.mochaOpts.reporterOptions = Object.assign(this.mochaOpts.reporterOptions, {
          //overwrite: false,
          html: false,
          json: true
        });
      }
    }

    const MochaNightwatch = MochaRunner.MochaNightwatch({settings, argv, addtOpts});
    this.mocha = new MochaNightwatch(this.mochaOpts, settings);
  }

  async runConcurrent(testEnvArray, modules) {
    this.checkReporterDependencies();

    this.concurrency = new Concurrency(this.settings, this.argv);
    const exitCode = await this.concurrency.runMultiple(testEnvArray, modules);

    await this.generateCombinedReport();

    return exitCode;
  }

  checkReporterDependencies() {
    if (this.argv.reporter !== 'mochawesome') {
      return;
    }

    try {
      require('mochawesome-report-generator');
      require('mochawesome-merge');
    } catch (err) {
      const error = new Error('Nightwatch needs some more packages when running in parallel and using the mochawesome reporter:');
      error.detailedErr = 'To install dependencies, please run:\n\tnpm install mochawesome-report-generator mochawesome-merge --save-dev';

      throw error;
    }
  }

  async generateCombinedReport() {
    if (!this.combinedReporterList.includes(this.argv.reporter)) {
      return;
    }

    const {reportDir} = this.mochaOpts.reporterOptions;

    switch (this.argv.reporter) {
      case 'mochawesome': {
        const marge = require('mochawesome-report-generator');
        const {merge} = require('mochawesome-merge');
        const files = reportDir ? `${path.join(reportDir, '*.json')}` : './mochawesome-report/*.json';

        const report = await merge({
          files: [files]
        });

        return marge.create(report, {});
      }
    }
  }

  isTestWorker() {
    return this.argv['test-worker'];
  }

  closeOpenSessions() {
    const mochaSuite = this.mocha.suite;
    const client = mochaSuite && mochaSuite.client;

    if (client && client.sessionId) {
      let request = client.transport.createHttpRequest({
        path: `/session/${client.sessionId}`
      });

      return new Promise(function(resolve, reject) {
        request.delete()
          .on('error', function(err) {
            resolve();
          })
          .on('success', function() {
            resolve();
          });
      });
    }

    return Promise.resolve();
  }

  registerUncaughtErr(err) {
  }
  /**
   * Main entry-point of the runner
   *
   * @return {Promise}
   */
  run(modules) {
    modules.forEach(module => this.mocha.addFile(module));

    return new Promise((resolve, reject) => {
      this.mocha.run(failures => {
        this.closeOpenSessions()
          .catch(err => {
            console.error(err.stack);
          })
          .then(_ => {
            if (this.mocha.suite && this.mocha.suite.client) {
              this.mocha.suite.client.transport.sessionFinished();
            }

            if (failures) {
              return reject(failures instanceof Error ? failures : new Error('Mocha reported test failures.'));
            }

            resolve();
          });
      });
    });

  }
}

module.exports = MochaRunner;
