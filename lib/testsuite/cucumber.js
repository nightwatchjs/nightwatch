const Cli =  require('@cucumber/cucumber/lib/cli').default;
const UserCodeRunner = require('@cucumber/cucumber/lib/user_code_runner').default;
const TestSuite =  require('./');
const {Logger} = require('../utils');
module.exports = class CucumberSuite extends TestSuite {
  constructor({modulePath, modules, settings, argv, addtOpts}) {
    super({modulePath, modules, settings, argv, addtOpts});

    this.settings = settings;
    this.gherkinDocEvents = [];
    this.scenario = [];
    this.testCases = [];
    this.currentTestCase=null;
    this.currentScenerio = null;
    this.currentDoc = null;
    this.results = [];
    this.cucumberCli = new Cli({argv: [process.execPath, require.resolve('@cucumber/cucumber'), settings.cucumber_feature_path, '--require', modulePath, ...argv.tags ?['--tags', argv.tags]:[]], cwd: process.cwd(), stdout: process.stdout});
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
        let testFailed = !results || !this.currentSuite.reporter.allTestsPassed;
        try {
          await this.currentSuite.terminate(testFailed ? 'FAILED' : '');
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