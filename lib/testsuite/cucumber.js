const Cli =  require('@cucumber/cucumber/lib/cli').default;
const UserCodeRunner = require('@cucumber/cucumber/lib/user_code_runner').default;
const TestSuite =  require('./');
const {Logger} = require('../utils');
module.exports = class CucumberSuite extends TestSuite {
  constructor({modulePath, modules, settings, argv, addtOpts}) {
    super({modulePath, modules, settings, argv, addtOpts});

    this.settings = settings;
    const {options} = this.settings.test_runner;
    this.cucumberParallelWorkers = options ? options.parallel : false;
    this.feature_path = options.feature_path;
    this.cucumberCli = new Cli({argv: [process.execPath, require.resolve('@cucumber/cucumber'), this.feature_path, ...this.cucumberParallelWorkers ? ['--require', 'lib/runner/test-runners/_setup_cucumber_parallel_runner.js'] : [], '--require', modulePath, ...argv.tags ? ['--tags', argv.tags] : [], ...this.cucumberParallelWorkers ? ['--parallel', this.cucumberParallelWorkers] : [], '--world-parameters', JSON.stringify(argv)], cwd: process.cwd(), stdout: process.stdout});
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
        .catch(err =>{
          if (!this.isAssertionError(err)) {Logger.error(err)}

          return err;
        })
        .then(testFailed=>{
          this.testSuiteFinished(testFailed);
        });
        
    }

    return this.createSession()
      .catch(err=>{
        err.sessionCreate = true;
        this.reporter.registerTestError(err);
        throw err;
      
      })
      .then(()=>this.cucumberCli.run())
      .catch(err => {
        if (err.sessionCreate) {throw err}
        
        if (!this.isAssertionError(err)) {Logger.error(err)}

        return err;
      })
      .then(async results=>{
        let testFailed = !results || !this.reporter.allTestsPassed;
        try {
          await this.terminate(testFailed ? 'FAILED' : '');
        } catch (err) {
          Logger.error(`Could not stop session in ${this.suiteName}:`);
          Logger.error(err);
        }

        return testFailed;
      })
      .catch(err=>
        this.terminate('Failed')
      )
      .then(testFailed=>{
        this.testSuiteFinished(testFailed);
      });
  }


    
};