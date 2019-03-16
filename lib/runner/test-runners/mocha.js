const Mocha = require('mocha');
const Nightwatch = require('../../index.js');
const TestSuite = require('../../testsuite/testsuite.js');
const Context = require('../../testsuite/context.js');

class CustomRunnable {
  static runHook(fn) {
    return CustomRunnable.run.call(this, fn, true);
  }

  static run(fn, isHook = false) {
    let self = this;
    let start = new Date();
    let ctx = this.ctx;
    let finished;
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
    function done (err) {
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
      let queueFinished = false;
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

      if (isHook) {
        args.push(function(err) {
          userCalled = true;
          onFinished(err);
        });
      }

      this.parent.nightwatchSuite.createSession()
        .then(_ => {
          this.parent.nightwatchSuite.createRunnable(this.title, () => {
            this.fn.apply(ctx, args);
          }).then(err => {
            queueFinished = true;

            if (!isHook) {
              done();
            }
          }).catch(err => {
            queueFinished = true;

            this.parent.nightwatchSuite.terminate('FAILED')
              .then(_ => done(err)).catch(err => done(err));
          });
        });
    } catch (err) {
      emitted = true;
      done(err);
    }
  }
}

class Extensions {
  static createClient(settings) {
    return Nightwatch.client(settings);
  }

  static __adaptRunnables(parent) {
    if (parent.parent && !parent.client) {
      parent.client = parent.parent.client;
    }

    Extensions.__adaptHooks(parent, ['_afterAll', '_afterEach', '_beforeAll', '_beforeEach']);
    parent.tests = parent.tests.map(function(test) {
      test.run = CustomRunnable.run.bind(test);

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
        hookInstance.run = CustomRunnable.runHook.bind(hookInstance);
      });

    });
  }
}

class CustomRunner extends Mocha.Runner {
  runSuite(suite, fn) {
    let isMainSuite = suite.parent && suite.parent.root;

    let createSession = new Promise(function(resolve, reject) {
      if (isMainSuite) {
        try {
          const testSuite = new TestSuite(suite.file, [], suite.client.settings, {});
          const context = new Context(suite.file, suite.client.settings);
          context.loadModule().readAttributes();

          suite.nightwatchSuite = testSuite;

          testSuite.createClient(suite.client)
            .createContext(context)
            .createSession()
            .then(data => {
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        } catch (err) {
          reject(err);
        }
      } else {
        if (!suite.root) {
          suite.nightwatchSuite = suite.parent.nightwatchSuite;
        }
        resolve(false);
      }
    });

    // create the nightwatch session
    createSession.then(sessionInfo => {
      // run the mocha suite
      super.runSuite(suite, fn);
    }).catch(err => {
      // an error occurred while trying to create the session
      this.failures = err;

      super.runSuite(suite, function(suiteErr) {
        suiteErr = suiteErr || err;
        fn(suiteErr);
      });
    });
  }

  run(fn) {
    Extensions.__adaptRunnables(this.suite);

    super.run(fn);
  }
}

class MochaNightwatch extends Mocha {
  constructor(mochaOpts, nightwatchSettings) {
    super(mochaOpts);
    this.nightwatchSettings = nightwatchSettings;
  }

  run(fn) {
    Mocha.Runner = CustomRunner;
    this.suite.client = Extensions.createClient(this.nightwatchSettings);

    return super.run(fn);
  }
}

class MochaRunner {
  get supportsConcurrency() {
    return false;
  }

  closeOpenSessions() {
    const mochaSuite = this.mocha.suite;
    const client = mochaSuite && mochaSuite.client;

    if (client && client.sessionId) {
      let request = client.transport.createHttpRequest({
        path : `/session/${client.sessionId}`
      });

      return new Promise(function(resolve, reject) {
        request.delete()
          .on('error', function(err) {
            console.warn(err);
            resolve();
          })
          .on('success', function() {
            resolve();
          });
      });
    }

    return Promise.resolve();
  }

  constructor(settings, argv, addtOpts) {
    this.startTime = new Date().getTime();
    this.settings = settings;
    this.argvOpts = argv;
    this.addtOpts = addtOpts;
    this.publishReport = false;

    let mochaOpts = settings.test_runner.options || {};
    mochaOpts.timeout = settings.globals.asyncHookTimeout;
    this.mocha = new MochaNightwatch(mochaOpts, settings);
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
            console.error(err);
          })
          .then(_ => {
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
