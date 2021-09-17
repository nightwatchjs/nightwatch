const Runner = require('./default');
const CucumberSuite = require('../../testsuite/cucumber');



class CucumberRunnner extends Runner {

  get supportsConcurrency() {
    return true;
  }

  constructor(settings, argv, addtOpts) {
    super(settings, argv, addtOpts);
   
  }
  createTestSuite({modulePath, modules}){
    const {settings, argv, addtOpts} = this;
    const testSuite = new CucumberSuite({modulePath, modules, settings, argv, addtOpts});
    testSuite.init();

    return testSuite;
  }

  runTests(modules) {
    const modulePath = modules.slice(0).shift();
    this.currentSuite = this.createTestSuite({modulePath, modules});

    return this.currentSuite.runTestSuite();

  }

  // Alternate Implementation Using cucumber Runtime
  // Gives a lot more control over events like test case started, test moudle started, etc
  
  /*
   *
  cucumberCli.client = this.client;
  try {
    await this.currentSuite.createSession();
    const results = await cucumberCli.run();
    await this.currentSuite.terminate(results ? '' : 'FAILED');
  } catch (err) {
    console.log(err);
    await this.currentSuite.terminate('FAILED');
  }
  this.currentSuite.testSuiteFinished();



  const gherkinMessageStream = GherkinStreams.fromPaths(['examples/cucumberJs/features/is_it_friday_yet.feature'], {
    newId: this._newId,
    relativeTo: this._cwd

  });

   
  const pickleIds =  await Cucumber.parseGherkinMessageStream({
    cwd: this._cwd,
    eventBroadcaster: this._eventBroadcaster,
    eventDataCollector: this._eventDataCollector,
    gherkinMessageStream,
    order: 'defined',
    pickleFilter: this._pickleFilter
  });
   
  // this.registerRequireModules();
    
  Cucumber.supportCodeLibraryBuilder.reset(this._cwd, this._newId);
  this.loadSpecFiles();
  Cucumber.setDefaultTimeout(10000);
  const supportCodeLibrary = Cucumber.supportCodeLibraryBuilder.finalize();

  const runtime = new Cucumber.Runtime({
    newId: this._newId,
    supportCodeLibrary,
    options: {
      dryRun: false,
      failFast: false,
      filterStackTrace: true,
      predictableIds: false,
      retry: 0,
      retryTagFilter: '',
      strict: true,
      worldParameters: {
        browser: this.client.api
      }

    },
    eventDataCollector: this._eventDataCollector,
    eventBroadcaster: this._eventBroadcaster,
    pickleIds
  });

  this.currentSuite.createSession(this.argv)
    .catch(err=>{
      err.sessionCreate = true;
      this.currentSuite.reporter.registerTestError(err);
      throw err;
    }).then(()=>{
      return runtime.start();
    })
    .then(results=> {

      return results;
    })
    .catch(err=>{
      if (err.sessionCreate) {
        throw err;
      }

      if (!this.currentSuite.isAssertionError(err)) {
        Logger.error(err);
      }

      return err;
    }).then(async (results)=>{
      await this.currentSuite.terminate(results ? '': 'FAILED');

      return this.currentSuite.testSuiteFinished(!results);
    });
    */
    
    
}

module.exports = CucumberRunnner;
