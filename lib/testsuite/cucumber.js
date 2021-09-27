const TestSuite =  require('./');
const {Logger} = require('../utils');
const logger = require('../utils/logger');
try {
  var Cli =  require('@cucumber/cucumber/lib/cli').default;
  var UserCodeRunner = require('@cucumber/cucumber/lib/user_code_runner').default;
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    Logger.error('Cucumber not installed');
    logger.info('You can  install it using "npm i @cucumber/cucumber"');
    process.exit(0);
  } else {throw err}
}

module.exports = class CucumberSuite extends TestSuite {
  constructor({modulePath, modules, settings, argv, addtOpts}) {
    super({modulePath, modules, settings, argv, addtOpts});
    this.settings = settings;
    
    //force all nightwatch commands to return promise
    this.settings.always_async_commands = true;

    const {options} = this.settings.test_runner;
    this.cucumberParallelWorkers = options ? options.parallel : false;
    this.feature_path = Array.isArray(options.feature_path) ? options.feature_path : [options.feature_path];
    this.specs = [];
    modules.forEach(module => {
      this.specs.push('--require', module);
    });
    this.cucumberCli = new Cli({argv: [process.execPath, require.resolve('@cucumber/cucumber'), ...this.feature_path, ...this.cucumberParallelWorkers ? ['--require', 'lib/runner/test-runners/_setup_cucumber_parallel_runner.js'] : [], ...this.specs, ...argv.tags ? ['--tags', argv.tags] : [], ...this.cucumberParallelWorkers ? ['--parallel', this.cucumberParallelWorkers] : [], '--world-parameters', JSON.stringify(argv)], cwd: process.cwd(), stdout: process.stdout});
  }

  createContext() {
    this.context = {
      unitTestingMode: false,
      getDesiredCapabilities: () => false,
      getEndSessionOnFail: () => true
    };
  };
  

  init() {
    this.addPropertiesToGlobalScope();
    this.createContext();
    this.createClient();

    // Remove timeout from cucumber-runner
    const originalCodeRunner = UserCodeRunner.run;
    UserCodeRunner.run =   function(props) {
      props.timeoutInMilliseconds = -1;

      return originalCodeRunner.call(this, props);
    };

  }

  async runTestSuite() {

    if (this.cucumberParallelWorkers) {
      return this.cucumberCli.run()
        .catch(err => {
          if (!this.isAssertionError(err)) {Logger.error(err)}

          return err;
        })
        .then(testFailed => {
          this.testSuiteFinished(testFailed);
        });
        
    }

    return this.createSession()
      .catch(err => {
        err.sessionCreate = true;
        this.reporter.registerTestError(err);
        throw err;
      
      })
      .then(() => this.cucumberCli.run())
      .catch(err => {
        if (err.sessionCreate) {
          throw err;
        }
        
        if (!this.isAssertionError(err)) {
          Logger.error(err);
        }

        return err;
      })
      .then(async results => {
        let testFailed = !results || !this.reporter.allTestsPassed;
        try {
          await this.terminate(testFailed ? 'FAILED' : '');
        } catch (err) {
          Logger.error(`Could not stop session in ${this.suiteName}:`);
          Logger.error(err);
        }

        return testFailed;
      })
      .catch(err =>
        this.terminate('Failed')
      )
      .then(testFailed => {
        return this.testSuiteFinished(testFailed);
      });
  }


    
};