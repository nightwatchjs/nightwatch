const path = require('path');
const Runner = require('./default');
const TestSuite =  require('../../testsuite');
const {Logger} = require('../../utils');

class CucumberSuite extends TestSuite {
  constructor({modulePath, modules, settings, argv}) {
    super({modulePath, modules, settings, argv, addtOpts: {
      globalHooks: {}
    }});

    // force all nightwatch commands to return promise
    this.settings.always_async_commands = true;

    const {options = {}} = this.settings.test_runner;
    if (this.argv.parallel) {
      const argvParallelCount = Number(this.argv.parallel);
      this.usingCucumberWorkers = Math.max(argvParallelCount, options.parallel || 2);
    }

    this.createCucumberCli();
  }

  createCucumberCli() {
    let CucumberCli;
    let UserCodeRunner;

    try {
      CucumberCli = require('@cucumber/cucumber/lib/cli').default;
      UserCodeRunner = require('@cucumber/cucumber/lib/user_code_runner').default;

      // Remove timeout from cucumber-runner
      const originalCodeRunner = UserCodeRunner.run;
      UserCodeRunner.run = function(props) {
        props.timeoutInMilliseconds = -1;

        return originalCodeRunner.call(this, props);
      };
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        const error = new Error('Cucumber needs to be installed as a project dependency as well.');
        error.detailedErr = 'You can install cucumber from NPM using:\n\tnpm i @cucumber/cucumber';

        throw error;
      }

      throw err;
    }

    const argv = this.getCliArgvForCucumber();

    this.cucumberCli = new CucumberCli({
      argv,
      cwd: process.cwd(),
      stdout: process.stdout
    });
  }

  getCliArgvForCucumber() {
    const specs = this.allModulePaths.reduce((prev, spec) => {
      prev.push('--require', spec);

      return prev;
    }, []);

    const {options} = this.settings.test_runner;
    if (!Array.isArray(options.feature_path)) {
      options.feature_path = [options.feature_path];
    }

    const {feature_path} = options;
    const parallelArgs = this.usingCucumberWorkers ? ['--require', path.join(__dirname, '_setup_cucumber_parallel_runner.js'), '--parallel', this.usingCucumberWorkers]: [];
    const tagsOption = this.argv.tags ? ['--tags', ...this.argv.tags] : [];
    const extraParams = ['--world-parameters', JSON.stringify(this.argv)];
    const formatOption = this.argv.format ? ['--format', this.argv.format] : [];

    return [
      process.execPath,
      require.resolve('@cucumber/cucumber')
    ].concat(feature_path, parallelArgs, specs, tagsOption, formatOption, extraParams);
  }

  createContext() {
    this.context = {
      unitTestingMode: false,
      getDesiredCapabilities() {
        return false;
      },
      getEndSessionOnFail() {
        return true;
      },
      getSuiteName() {
        return '[Cucumber Testsuite]';
      },
      retries: {
        testcase: 0,
        suite: 0
      }
    };
  };

  init() {
    this.addPropertiesToGlobalScope();
    this.createContext();
    this.setSuiteName();
    this.setRetries();
    this.createClient();
  }

  testSuiteRunFn() {
    return this.cucumberCli.run()
      .catch(err => {
        if (err.sessionCreate) {
          throw err;
        }

        if (!this.isAssertionError(err)) {
          console.error(err);
        }

        return err;
      });
  }

  onTestSuiteFinished(result) {
    const failures = result.success === false;

    return super.onTestSuiteFinished(failures);
  }

  runTestSuite() {
    if (this.usingCucumberWorkers) {
      return this.cucumberCli.run()
        .catch(err => {
          if (!this.isAssertionError(err)) {
            Logger.error(err);
          }

          return err;
        })
        .then(testFailed => this.onTestSuiteFinished(testFailed));
    }

    return super.runTestSuite();
  }
}

class CucumberRunnner extends Runner {
  get supportsConcurrency() {
    return true;
  }

  get type() {
    return 'cucumber';
  }

  createTestSuite({modulePath, modules}) {
    const {settings, argv, addtOpts} = this;
    const testSuite = new CucumberSuite({modulePath, modules, settings, argv, addtOpts});
    testSuite.init();

    return testSuite;
  }

  async runTests(modules) {
    try {
      const modulePath = modules.slice(0).shift();
      this.currentSuite = this.createTestSuite({modulePath, modules});

      return await this.currentSuite.runTestSuite();
    } catch (err) {
      this.currentSuite.testSuiteFinished(true);

      throw err;
    }
  } 
}

module.exports = CucumberRunnner;
