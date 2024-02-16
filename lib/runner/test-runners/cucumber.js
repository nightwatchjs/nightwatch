const path = require('path');
const Runner = require('./default');
const TestSuite =  require('../../testsuite');
const {Logger, isString, isDefined} = require('../../utils');
const {NightwatchEventHub} = require('../eventHub.js');
const {getTestSourceForRerunFailed} = require('../rerunUtil.js');
const DefaultSettings = require('../../settings/defaults.js');

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
    return path.join(__dirname, './cucumber/_setup_cucumber_runner.js');
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

  shouldUseNightwatchFormatter(options) {
    return (NightwatchEventHub.isAvailable ||
      options.format === 'nightwatch-format' ||
      this.argv.format === 'nightwatch-format'
    );
  }

  getCliArgvForCucumber() {
    const specs = this.createInitialRequires();
    const {options} = this.settings.test_runner;

    if ((process.env.NIGHTWATCH_RERUN_FAILED === 'true' || this.argv['rerun-failed'])) {
      options.feature_path = getTestSourceForRerunFailed(this.settings);
    }

    if (options.feature_path && !Array.isArray(options.feature_path)) {
      options.feature_path = [options.feature_path];
    }

    if (this.shouldUseNightwatchFormatter(options)) {
      options.format = [...(options.format || []), path.join(__dirname, './cucumber/nightwatch-format.js')];
    }

    const {feature_path = ''} = options;
    const parallelArgs = this.usingCucumberWorkers ? ['--parallel', this.usingCucumberWorkers] : [];
    const additionalOptions = this.buildArgvValue(['tags', 'retry-tag-filter', 'profile', 'format', 'format-options', 'dry-run', 'fail-fast', ['retry', 'retries'], 'no-strict', 'name']);
    const extraParams = ['--world-parameters', JSON.stringify({...this.argv, settings: this.settings})];

    return [
      process.execPath,
      require.resolve('@cucumber/cucumber')
    ].concat(feature_path, parallelArgs, specs, additionalOptions, extraParams);
  }

  createInitialRequires() {
    const {options} = this.settings.test_runner;
    const isESMEnable = options.enable_esm ||  this.argv['enable-esm'];
    const importTypeArgument = isESMEnable ? '--import' : '--require';
    const initialRequires = [
      importTypeArgument, CucumberSuite.cucumberSetupFile
    ];

    if (isESMEnable){
      initialRequires.push(...this.buildArgvValue(['import']));
    } else {
      initialRequires.push(...this.buildArgvValue(['require', 'require-module']));
    }

    return this.allModulePaths.reduce((prev, spec) => {
      prev.push(importTypeArgument, spec);

      return prev;
    }, initialRequires);
  }

  mergeCliConfigValues(key) {
    const {options = {}} = this.settings.test_runner;

    return Array.from(new Set([
      ...(Array.isArray(this.argv[key]) ? this.argv[key] : (isString(this.argv[key]) ? [this.argv[key]] : [])),
      ...(Array.isArray(options[key]) ? options[key] : (isString(options[key]) ? [options[key]] : []))
    ]));
  }

  buildArgvValue(argNames) {
    if (isString(argNames)) {
      argNames = [argNames];
    }

    return argNames.reduce((prev, argName) => {
      let key = argName;

      if (Array.isArray(argName) && argName.length === 2) {
        key = argName[0];
        argName = argName[1];
      }

      const {options = {}} = this.settings.test_runner;

      const allArgv = {
        ...options,
        ...this.argv,
        require: this.mergeCliConfigValues('require'),
        requireModule: this.mergeCliConfigValues('requireModule'),
        format: this.mergeCliConfigValues('format'),
        paths: this.mergeCliConfigValues('paths'),
        import: this.mergeCliConfigValues('import')
      };

      if ((isDefined(allArgv[argName]) && allArgv[argName] !== '') ||
          (isDefined(allArgv[key]) && allArgv[key] !== '')
      ) {
        let argValues = allArgv[argName] || allArgv[key];
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
    return false;
  }

  get type() {
    return 'cucumber';
  }

  constructor(settings, argv, addtOpts) {
    super(settings, argv, addtOpts);

    // Disable HTML Reporter as it is not yet supported in Cucumber.
    const reporterFile = this.globalReporter.reporterFile;
    if (reporterFile && reporterFile.includes('html')) {
      if (reporterFile.toString() !== DefaultSettings.default_reporter.toString()) {
        // user has specifically asked for HTML report.
        // eslint-disable-next-line no-console
        console.warn(Logger.colors.yellow('HTML reporter is not supported with Cucumber runner.'));
      }

      const index = reporterFile.indexOf('html');
      if (index > -1) {
        reporterFile.splice(index, 1);
      }
    }
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
