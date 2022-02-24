const path = require('path');
const Runner = require('./default');
const TestSuite =  require('../../testsuite');
const {Logger, isString, isDefined} = require('../../utils');

class CucumberSuite extends TestSuite {
  static isSessionCreateError(err) {
    return [
      'You appear to be executing an install of cucumber',
      'Must be locally installed.'
    ].some(item => err.message.includes(item));
  }

  static createCli(settings) {
    let CucumberCli;

    try {
      CucumberCli = require('@cucumber/cucumber/lib/cli/index').default;
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        const error = new Error('Cucumber needs to be installed as a project dependency.');
        error.showTrace = false;
        error.detailedErr = 'You can install cucumber from NPM using:\n\n        ' + Logger.colors.light_green('npm i @cucumber/cucumber');

        throw error;
      }

      err.showTrace = false;
      err.sessionCreate = true;

      throw err;
    }

    return CucumberCli;
  }

  static get cucumberSetupFile() {
    return path.join(__dirname, '../../../cucumber-js/_setup_cucumber_runner.js');
  }

  constructor({modulePath, modules, settings, argv}) {
    super({modulePath, modules, settings, argv, addtOpts: {
      globalHooks: {}
    }});

    // force all nightwatch commands to return promise
    this.settings.always_async_commands = true;

    const minWorkersCount = 2;
    const {options = {}} = this.settings.test_runner;
    if (this.argv.parallel) {
      const argvParallelCount = Number(this.argv.parallel);
      this.usingCucumberWorkers = Math.max(argvParallelCount, options.parallel || minWorkersCount);
    }

    this.reporter = {
      testSuiteFinished() {},
      allTestsPassed: true
    };

    try {
      this.createCucumberCli();
    } catch (err) {
      const {message} = err;

      if (!err.detailedErr) {
        err.detailedErr = message;
        err.message = 'An error occurred while trying to initialize the Cucumber runner:';
      }

      err.sessionCreate = true;

      Logger.error(err);

      throw err;
    }
  }

  createCucumberCli() {
    const CucumberCli = CucumberSuite.createCli(this.settings);
    const argv = this.getCliArgvForCucumber();

    this.cucumberCli = new CucumberCli({
      argv,
      env: process.env,
      cwd: process.cwd(),
      stdout: process.stdout
    });
  }

  getCliArgvForCucumber() {
    const specs = this.createInitialRequires();
    const {options} = this.settings.test_runner;

    if (options.feature_path && !Array.isArray(options.feature_path)) {
      options.feature_path = [options.feature_path];
    }
    const {feature_path = ''} = options;
    const parallelArgs = this.usingCucumberWorkers ? ['--parallel', this.usingCucumberWorkers]: [];
    const additionalOptions = this.buildArgvValue(['tags', 'retry-tag-filter', 'profile', 'format', 'format-options', 'dry-run', 'fail-fast', ['retries', 'retry'], 'no-strict', 'name']);
    const extraParams = ['--world-parameters', JSON.stringify(this.argv)];

    return [
      process.execPath,
      require.resolve('@cucumber/cucumber')
    ].concat(feature_path, parallelArgs, specs, additionalOptions, extraParams);
  }

  createInitialRequires() {
    const initialRequires = [
      '--require', CucumberSuite.cucumberSetupFile
    ];

    initialRequires.push(...this.buildArgvValue(['require', 'require-module']));

    return this.allModulePaths.reduce((prev, spec) => {
      prev.push('--require', spec);

      return prev;
    }, initialRequires);
  }

  buildArgvValue(argNames) {
    if (isString(argNames)) {
      argNames = [argNames];
    }

    return argNames.reduce((prev, argName) => {
      let key = argName;

      if (Array.isArray(argName) && argName.length === 2) {
        key = argName[1];
        argName = argName[0];
      }

      if (isDefined(this.argv[argName]) && this.argv[argName] !== '') {
        let argValues = this.argv[argName];
        if (!Array.isArray(argValues)) {
          argValues = [argValues];
        }

        argValues.forEach(value => {
          const args = [`--${key}`];
          if (value !== true) {
            args.push(value);
          }

          prev.push(...args);
        });
      }

      return prev;
    }, []);
  }

  onTestSuiteFinished(result) {
    const failures = result.success === false;

    return super.onTestSuiteFinished(failures);
  }

  testSuiteFinished() {}

  async runTestSuite() {
    let result;
    try {
      result = await this.cucumberCli.run();
    } catch (err) {
      if (CucumberSuite.isSessionCreateError(err)) {
        const {message} = err;
        err.message = 'An error occurred while trying to start Cucumber CLI:';
        err.detailedErr = message;
        err.sessionCreate = true;
        err.showTrace = false;

        Logger.error(err);

        throw err;
      }

      if (err.sessionCreate && !this.usingCucumberWorkers) {
        throw err;
      }

      if (!this.isAssertionError(err)) {
        Logger.error(err);

        throw err;
      }

      result = err;
    }

    return result;
  }
}

class CucumberRunnner extends Runner {
  get supportsConcurrency() {
    return true;
  }

  get type() {
    return 'cucumber';
  }

  hasTestFailures(result) {
    return result && result.success === false;
  }

  createTestSuite({modulePath, modules}) {
    const {settings, argv, addtOpts} = this;

    return new CucumberSuite({modulePath, modules, settings, argv, addtOpts});
  }

  async runTests(modules) {
    const modulePath = modules.slice(0).shift();
    this.currentSuite = this.createTestSuite({modulePath, modules});

    return await this.currentSuite.runTestSuite();
  }
}

module.exports = CucumberRunnner;
