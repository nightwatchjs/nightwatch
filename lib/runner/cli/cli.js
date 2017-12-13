const path = require('path');
const Q = require('q');
const clone = require('lodash.clone');
const defaultsDeep = require('lodash.defaultsdeep');

const TestSource = require('./test-source.js');
const Settings = require('../../settings/settings.js');
const Concurrency = require('../concurrency/concurrency.js');
const ChildProcess = require('../concurrency/child-process.js');

const Runner = require('../run.js');
const Logger = require('../../util/logger.js');
const Utils = require('../../util/utils.js');
const Selenium = require('../selenium.js');
const ErrorHandler = require('./errorhandler.js');

class CliRunner {
  static get DEFAULT_ENV() {
    return 'default';
  }

  static get CONFIG_JS_FILE() {
    return './nightwatch.conf.js';
  }

  constructor(argv = {}) {
    this.argv = argv;
    this.argvSetup = require('./argv-setup.js');
    this.baseSettings = this.loadConfig();
    this.concurrency = new Concurrency(this.argv);
    this.testSource = new TestSource(this.settings.src_folders, this.argv);

    this.setCurrentTestEnv();

    this.manageSelenium = this.isSeleniumServerManaged();
  }

  static parseSettings(settings = {}, baseSettings = {}, argv = {}, testEnv = null) {
    let instanceSettings = new Settings(baseSettings, argv);
    instanceSettings.init(testEnv, settings);

    return instanceSettings.settings;
  }

  get settings() {
    return this.baseSettings;
  }

  setCurrentTestEnv() {
    this.testEnv = typeof this.argv.env == 'string' ? this.argv.env : CliRunner.DEFAULT_ENV;

    return this;
  }

  isSeleniumServerManaged() {
    return !this.isParallelMode() && this.baseSettings.selenium && this.settings.selenium.start_process || false
  }

  /**
   * @deprecated
   * @param {function} [done]
   * @return {CliRunner}
   */
  init(done) {
    this.parseTestSettings({}, done);

    return this;
  }

  /**
   * @param {object} [settings]
   * @param {function} [done]
   * @return {CliRunner}
   */
  setup(settings, done) {
    this.parseTestSettings(settings, done);

    return this;
  }

  isDefaultConfig() {
    return this.argvSetup.command('config').isDefault(this.argv.config);
  }

  loadConfig() {
    // use default nightwatch.json file if we haven't received another value
    if (this.isDefaultConfig()) {
      let defaultValue = this.argvSetup.command('config').defaults();
      let localJsValue = path.resolve(CliRunner.CONFIG_JS_FILE);

      if (Utils.fileExistsSync(localJsValue)) {
        this.argv.config = localJsValue;
      } else if (Utils.fileExistsSync(defaultValue)) {
        this.argv.config = path.join(path.resolve('./'), this.argv.config);
      } else {
        throw new Error('Missing nightwatch config file. Please make sure you have either nightwatch.json or nightwatch.conf.js defined in the current folder.')
      }
    } else {
      this.argv.config = path.resolve(this.argv.config);
    }

    return require(this.argv.config);
  }

  /**
   * Validates and parses the test settings
   * @param {object} [settings]
   * @param {function} [done]
   * @returns {CliRunner}
   */
  parseTestSettings(settings = {}, done = function() {}) {
    // checking if the env passed is valid
    if (this.baseSettings && !this.baseSettings.test_settings) {
      throw new Error('No testing environment defined in the configuration file.\n'+
        '  Please consult the docs at: http://nightwatchjs.org/gettingstarted#settings-file');
    }

    let env = this.argv && this.argv.env;

    if (env) {
      const envs = env.split(',');

      for (let i = 0; i < envs.length; i++) {
        if (!(envs[i] in this.baseSettings.test_settings)) {
          let available = Object.keys(this.baseSettings.test_settings).map(key => {
            return typeof this.baseSettings.test_settings[key] == 'object' && this.baseSettings.test_settings[key];
          });

          throw new Error(`Invalid testing environment specified: ${envs[i]}. Available environments are: ${available.join(', ')}`);
        }
      }

      if (envs.length > 1) {
        this.concurrency.runEnvironments(envs, done);
        return this;
      }
    }

    this.initTestSettings(settings);

    if (this.parallelModeWorkers()) {
      this.concurrency.runTestWorkers(done);
    }

    return this;
  }

  parallelModeWorkers() {
    return this.test_settings.testWorkersEnabled && !this.testSource.isTestWorker();
  }

  /**
   * Sets the specific test settings for the specified environment
   * @param {string} [env]
   * @param {object} [settings]
   * @returns {CliRunner}
   */
  initTestSettings(settings = {}) {
    this.test_settings = CliRunner.parseSettings(settings, this.baseSettings, this.argv, this.testEnv);

    if (this.test_settings.disable_colors) {
      Logger.disableColors();
    }

    return this;
  }
}


function CliRunner(argv) {
  this.settings = null;
  this.envSettings = null;
  this.output_folder = '';
  this.parallelMode = false;
  this.runningProcesses = {};
}

CliRunner.prototype = {


  /**
   * Reads globals from an external js or json file set in the settings file
   * @return {CliRunner}
   */
  readExternalGlobals() {

  },



  /**
   * Starts the selenium server process
   * @param {function} [callback]
   * @returns {CliRunner}
   */
  startSelenium : function(callback) {
    callback = callback || function() {};

    if (this.isTestWorker()) {
      callback();
      return this;
    }

    var globalsContext = this.envSettings && this.envSettings.globals || null;
    // adding a link to the test_settings object on the globals context
    if (globalsContext) {
      globalsContext.envSettings = this.envSettings;
    }

    var beforeGlobal = Utils.checkFunction('before', globalsContext) || function(done) {done();};
    var self = this;
    if (!this.manageSelenium) {
      beforeGlobal.call(globalsContext, function() {
        callback();
      });
      return this;
    }

    this.settings.parallelMode = this.parallelMode;

    beforeGlobal.call(globalsContext, function() {
      Selenium.startServer(self.settings, function(error, child, error_out, exitcode) {
        if (error) {
          console.error('There was an error while starting the Selenium server:');
          ErrorHandler.handle({
            message : error_out
          });

          return;
        }
        callback();
      });
    });

    return this;
  },

  /**
   * Stops the selenium server if it is running
   * @return {*|promise}
   */
  stopSelenium : function() {
    var deferred = Q.defer();

    if (this.manageSelenium) {
      Selenium.stopServer(function() {
        deferred.resolve();
      });
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  },

  /**
   * Starts the test runner
   *
   * @param {function} [finished] optional callback
   * @returns {CliRunner}
   */
  runTests : function(finished) {
    if (this.parallelMode) {
      return this;
    }

    var self = this;
    var handleError = ErrorHandler.handle;

    this.startSelenium(function() {

      self.runner(function(err, results) {
        self.stopSelenium().then(function() {
          if (self.isTestWorker()) {
            handleError(err, results, finished);
            return;
          }

          self.runGlobalAfter().then(function (ex) {
            handleError(ex || err, results, finished);
          });
        });
      });
    });

    return this;
  },

  runner : function(fn) {
    var testRunner = this.settings.test_runner || 'default';
    var testRunnerType = testRunner.type ? testRunner.type : testRunner;

    // getTestSource() will throw on an error, so we need
    // to wrap and pass along any error that does occur
    // to the callback fn

    var source;
    try {
      source = this.getTestSource();
    } catch (err) {
      fn(err, {});
      return;
    }

    switch (testRunnerType) {
      case 'default':
        var runner = new Runner(source, this.envSettings, {
          output_folder : this.output_folder,
          src_folders : this.settings.src_folders,
          live_output : this.settings.live_output,
          detailed_output : this.settings.detailed_output,
          start_session: this.startSession,
          reporter : this.argv.reporter,
          testcase : this.argv.testcase,
          end_session_on_fail : this.endSessionOnFail,
          retries : this.argv.retries,
          test_worker : this.isTestWorker(),
          suite_retries : this.argv.suiteRetries
        }, fn);
        return runner.run();

      case 'mocha':
        var MochaNightwatch = require('mocha-nightwatch');
        var mochaOpts = testRunner.options || {
            ui : 'bdd'
          };

        var mocha = new MochaNightwatch(mochaOpts);
        var nightwatch = require('../../index.js');

        Runner.setFinishCallback(fn);
        Runner.readPaths(source, this.envSettings, function(error, modulePaths) {
          if (error) {
            fn(error, {});
            return;
          }
          modulePaths.forEach(function(file) {
            mocha.addFile(file);
          });

          mocha.run(nightwatch, this.envSettings, function(failures) {
            fn(null, {
              failed : failures
            });

            if (failures) {
              process.exit(10);
            }
          });

        }.bind(this));

        return mocha;
    }
  },

  inheritFromDefaultEnv : function() {
    if (this.argv.env == 'default') {
      return;
    }

    var defaultEnv = this.settings.test_settings['default'] || {};
    defaultsDeep(this.envSettings, defaultEnv);

    return this;
  },

  runGlobalAfter : function() {
    var deferred = Q.defer();

    var globalsContext = this.envSettings && this.envSettings.globals || null;
    var afterGlobal = Utils.checkFunction('after', globalsContext) || function(done) {done();};
    try {
      afterGlobal.call(globalsContext, function done() {
        deferred.resolve(null);
      });
    } catch (ex) {
      deferred.resolve(ex);
    }

    return deferred.promise;
  },



  setGlobalOutputOptions: function () {
    this.envSettings.output = this.envSettings.output || (this.settings.output && typeof this.envSettings.output == 'undefined');
    this.envSettings.silent = this.envSettings.silent || typeof this.envSettings.silent == 'undefined';
    if (this.argv.verbose) {
      this.envSettings.silent = false;
    }

    return this;
  },

  /**
   *
   * @param {Object} [test_settings]
   * @returns {CliRunner}
   */
  updateTestSettings : function(test_settings) {
    if (this.parallelMode && !this.parallelModeWorkers()) {
      return this;
    }

    if (test_settings && typeof test_settings == 'object') {
      for (var key in test_settings) {
        this.envSettings[key] = test_settings[key];
      }
    }

    this.settings.selenium = this.settings.selenium || {};

    // overwrite selenium settings per environment
    if (Utils.isObject(this.envSettings.selenium)) {
      for (var prop in this.envSettings.selenium) {
        this.settings.selenium[prop] = this.envSettings.selenium[prop];
      }
    }

    this.manageSelenium = !this.isParallelMode() && this.settings.selenium.start_process || false;
    this.startSession = this.settings.selenium.start_session || typeof this.settings.selenium.start_session == 'undefined';

    this.mergeSeleniumOptions();
    this.disableCliColorsIfNeeded();

    this.endSessionOnFail = typeof this.settings.end_session_on_fail == 'undefined' || this.settings.end_session_on_fail;
    if (typeof this.envSettings.end_session_on_fail != 'undefined') {
      this.endSessionOnFail = this.envSettings.end_session_on_fail;
    }
    return this;
  },

  disableCliColorsIfNeeded : function() {
    if (this.settings.disable_colors || this.envSettings.disable_colors) {
      Logger.disableColors();
    }
    return this;
  },

  /**
   * Backwards compatible method which attempts to merge deprecated driver specific options for selenium
   * @returns {CliRunner}
   */
  mergeSeleniumOptions : function() {
    if (!this.manageSelenium) {
      return this;
    }
    this.settings.selenium.cli_args = this.settings.selenium.cli_args || {};
    this.mergeCliArgs();

    var deprecationNotice = function(propertyName, newSettingName) {
      ErrorHandler.logWarning('DEPRECATION NOTICE: Property ' + propertyName + ' is deprecated since v0.5. Please' +
        ' use the "cli_args" object on the "selenium" property to define "' + newSettingName + '". E.g.:');
      var demoObj = '{\n' +
        '  "cli_args": {\n' +
        '    "'+ Logger.colors.yellow(newSettingName) +'": "<VALUE>"\n' +
        '  }\n' +
        '}';

      console.log(demoObj, '\n');
    };

    if (this.envSettings.firefox_profile) {
      deprecationNotice('firefox_profile', 'webdriver.firefox.profile');
      this.settings.selenium.cli_args['webdriver.firefox.profile'] = this.envSettings.firefox_profile;
    }
    if (this.envSettings.chrome_driver) {
      deprecationNotice('chrome_driver', 'webdriver.chrome.driver');
      this.settings.selenium.cli_args['webdriver.chrome.driver'] = this.envSettings.chrome_driver;
    }
    if (this.envSettings.ie_driver) {
      deprecationNotice('ie_driver', 'webdriver.ie.driver');
      this.settings.selenium.cli_args['webdriver.ie.driver'] = this.envSettings.ie_driver;
    }

    return this;
  },

  /**
   * Merge current environment specific cli_args into the main cli_args object to be passed to selenium
   *
   * @returns {CliRunner}
   */
  mergeCliArgs : function() {
    if (Utils.isObject(this.envSettings.cli_args)) {
      for (var prop in this.envSettings.cli_args) {
        if (this.envSettings.cli_args.hasOwnProperty(prop)) {
          this.settings.selenium.cli_args[prop] = this.envSettings.cli_args[prop];
        }
      }
    }
    return this;
  },

  ////////////////////////////////////////////////////////////////////////////////////
  // Parallelism related
  ////////////////////////////////////////////////////////////////////////////////////
  isParallelMode : function() {
    return process.env.__NIGHTWATCH_PARALLEL_MODE === '1';
  },

  isTestWorker : function() {
    return this.isParallelMode() && this.argv['test-worker'];
  },

  parallelModeWorkers: function () {
    return !this.isParallelMode() && !this.singleSourceFile() && (this.settings.test_workers === true ||
      Utils.isObject(this.settings.test_workers) && this.settings.test_workers.enabled);
  },

  /**
   * Enables parallel execution mode
   * @param {Array} envs
   * @param {function} [done]
   * @returns {CliRunner}
   */
  setupParallelMode : function(envs, done) {
    this.parallelMode = true;
    var self = this;

    this.startSelenium(function() {
      self.startChildProcesses(envs, function(code) {
        self.stopSelenium().then(function() {
          if (self.parallelModeWorkers()) {
            return self.runGlobalAfter();
          }

          return true;
        }).then(function() {
          if (done) {
            try {
              done(self.childProcessOutput, code);
            } catch (err) {
              done(err);
            }
          }

          if (code) {
            process.exit(code);
          }
        });

      });
    });

    return this;
  },

  getAvailableColors : function () {
    var availColors = [
      ['red', 'light_gray'],
      ['green', 'black'],
      ['blue', 'light_gray'],
      ['magenta', 'light_gray']
    ];
    var currentIndex = availColors.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = availColors[currentIndex];
      availColors[currentIndex] = availColors[randomIndex];
      availColors[randomIndex] = temporaryValue;
    }
    return availColors;
  },

  /**
   * Start a new child process for each environment
   * @param {Array} envs
   * @param {function} doneCallback
   */
  startChildProcesses : function(envs, doneCallback) {
    doneCallback = doneCallback || function() {};

    var availColors = this.getAvailableColors();

    this.childProcessOutput = {};
    ChildProcess.prevIndex = 0;

    var args = this.getChildProcessArgs(envs);

    if (envs === null) {
      this.startTestWorkers(availColors, args, doneCallback);
      return this;
    }

    this.startEnvChildren(envs, availColors, args, doneCallback);
  },

  startEnvChildren : function(envs, availColors, args, doneCallback) {
    var self = this;
    var globalExitCode = 0;

    envs.forEach(function(environment, index) {
      self.childProcessOutput[environment] = [];
      var childArgs = args.slice();
      childArgs.push('--env', environment);

      var child = new ChildProcess(environment, index, self.childProcessOutput[environment], self.settings, childArgs);
      child.setLabel(environment + ' environment');
      self.runningProcesses[child.itemKey] = child;
      self.runningProcesses[child.itemKey].run(availColors, function(output, exitCode) {
        if (exitCode > 0) {
          globalExitCode = exitCode;
        }
        if (self.processesRunning() === 0) {
          if (!self.settings.live_output) {
            self.printChildProcessOutput();
          }
          doneCallback(globalExitCode);
        }
      });
    });
  },

  getChildProcessArgs : function(envs) {
    var childProcessArgs = [];
    var arg;

    for (var i = 2; i < process.argv.length; i++) {
      arg = process.argv[i];
      if (envs && (arg == '-e' || arg == '--env')) {
        i++;
      } else {
        childProcessArgs.push(arg);
      }
    }

    return childProcessArgs;
  },

  startTestWorkers : function(availColors, args, doneCallback) {
    var workerCount = this.getTestWorkersCount();
    var source = this.getTestSource();
    var self = this;
    var globalExitCode = 0;
    var globalStartTime = new Date().getTime();
    var globalResults = {
      errmessages : [],
      modules : {},
      passed : 0,
      failed : 0,
      errors : 0,
      skipped : 0,
      tests : 0
    };

    var Reporter = require('../../runner/reporter.js');
    var globalReporter = new Reporter(globalResults, {}, globalStartTime, {start_session: this.startSession});

    Runner.readPaths(source, this.envSettings, function(error, modulePaths) {
      if (error) {
        ErrorHandler.handle(error, null, doneCallback);
        return;
      }

      var remaining = modulePaths.length;
      Utils.processAsyncQueue(workerCount, modulePaths, function(modulePath, index, next) {
        var outputLabel = Utils.getModuleKey(modulePath, self.settings.src_folders, modulePaths);
        var childOutput = self.childProcessOutput[outputLabel] = [];

        // arguments to the new child process, essentially running a single test suite
        var childArgs = args.slice();
        childArgs.push('--test', modulePath, '--test-worker');

        var settings = clone(self.settings);
        settings.output = settings.output && settings.detailed_output;

        var child = new ChildProcess(outputLabel, index, childOutput, settings, childArgs);
        child.setLabel(outputLabel);
        child.on('result', function(childResult) {
          switch (childResult.type) {
            case 'testsuite_finished':
              globalResults.modules[childResult.moduleKey] = childResult.results;
              if (childResult.errmessages.length) {
                globalResults.errmessages.concat(childResult.errmessages);
              }

              globalResults.passed += childResult.passed;
              globalResults.failed += childResult.failed;
              globalResults.errors += childResult.errors;
              globalResults.skipped += childResult.skipped;
              globalResults.tests += childResult.tests;

              self.printChildProcessOutput(childResult.itemKey);
              break;
            case 'testsuite_started':

              break;
          }

        });

        self.runningProcesses[child.itemKey] = child;
        self.runningProcesses[child.itemKey].run(availColors, function (output, exitCode) {
          if (exitCode > 0) {
            globalExitCode = exitCode;
          }
          remaining -=1;
          if (remaining > 0) {
            next();
          } else {

            if (!self.settings.live_output) {
              globalReporter.printTotalResults();
            }

            doneCallback(globalExitCode);
          }
        });
      });
    });
  },

  printChildProcessOutput : function(label) {
    var self = this;

    if (label) {
      self.childProcessOutput[label] = self.childProcessOutput[label].filter(function(item) {
        return item !== '';
      }).map(function(item) {
        if (item == '\\n') {
          item = '\n';
        }

        return item;
      });

      self.childProcessOutput[label].forEach(function(output) {
        process.stdout.write(output + '\n');
      });

      self.childProcessOutput[label].length = 0;
      return;
    }

    Object.keys(this.childProcessOutput).forEach(function(environment) {
      self.printChildProcessOutput(environment);
    });
  },

  getTestWorkersCount : function() {
    var workers = 1;
    if (this.settings.test_workers === true || this.settings.test_workers.workers === 'auto') {
      workers = require('os').cpus().length;
    } else if ('number' === typeof this.settings.test_workers.workers) {
      workers = this.settings.test_workers.workers;
    }

    return workers;
  },

  processesRunning : function() {
    var running = 0;
    for (var item in this.runningProcesses) {
      if (this.runningProcesses.hasOwnProperty(item) && this.runningProcesses[item].processRunning) {
        running += 1;
      }
    }
    return running;
  }
};

module.exports = CliRunner;
