const CucumberSuite = require('../../testsuite/cucumber');
const Concurrency = require('../concurrency');



class CucumberRunnner {

  

  get supportsConcurrency() {
    return false;
  }

  constructor(settings, argv, addtOpts) {
    this.startTime = new Date().getTime();
    this.settings = settings;
    this.argv = argv;
    this.addtOpts = addtOpts;
    this.publishReport = true; // in-case of an uncaught exception, the report will not be published

   
  }

  get client() {
    return this.currentSuite && this.currentSuite.client;
  }



  

  createTestSuite({modulePath, modules}){
    const {settings, argv, addtOpts} = this;


    const testSuite = new CucumberSuite({modulePath, modules, settings, argv, addtOpts});
    testSuite.init();

    return testSuite;
  }

  /**
   * Main entry-point of the runner
   *
   * @return {Promise}
   */
  async run(modules) {
    const modulePath = modules.slice(0).shift();
    this.currentSuite = this.createTestSuite({modulePath, modules});

    return  this.currentSuite.runTestSuite();

    
    // cucumberCli.client = this.client;
    // try {
    //   await this.currentSuite.createSession();
    //   const results = await cucumberCli.run();
    //   await this.currentSuite.terminate(results ? '' : 'FAILED');
    // } catch (err) {
    //   console.log(err);
    //   await this.currentSuite.terminate('FAILED');
    // }
    // this.currentSuite.testSuiteFinished();



    // const gherkinMessageStream = GherkinStreams.fromPaths(['examples/cucumberJs/features/is_it_friday_yet.feature'], {
    //   newId: this._newId,
    //   relativeTo: this._cwd

    // });

   
    // const pickleIds =  await Cucumber.parseGherkinMessageStream({
    //   cwd: this._cwd,
    //   eventBroadcaster: this._eventBroadcaster,
    //   eventDataCollector: this._eventDataCollector,
    //   gherkinMessageStream,
    //   order: 'defined',
    //   pickleFilter: this._pickleFilter
    // });
   
    // // this.registerRequireModules();
    
    // Cucumber.supportCodeLibraryBuilder.reset(this._cwd, this._newId);
    // this.loadSpecFiles();
    // Cucumber.setDefaultTimeout(10000);
    // const supportCodeLibrary = Cucumber.supportCodeLibraryBuilder.finalize();

    // const runtime = new Cucumber.Runtime({
    //   newId: this._newId,
    //   supportCodeLibrary,
    //   options: {
    //     dryRun: false,
    //     failFast: false,
    //     filterStackTrace: true,
    //     predictableIds: false,
    //     retry: 0,
    //     retryTagFilter: '',
    //     strict: true,
    //     worldParameters: {
    //       browser: this.client.api
    //     }

    //   },
    //   eventDataCollector: this._eventDataCollector,
    //   eventBroadcaster: this._eventBroadcaster,
    //   pickleIds
    // });

    // this.currentSuite.createSession(this.argv)
    //   .catch(err=>{
    //     err.sessionCreate = true;
    //     this.currentSuite.reporter.registerTestError(err);
    //     throw err;
    //   }).then(()=>{
    //     return runtime.start();
    //   })
    //   .then(results=> {

    //     return results;
    //   })
    //   .catch(err=>{
    //     if (err.sessionCreate) {
    //       throw err;
    //     }

    //     if (!this.currentSuite.isAssertionError(err)) {
    //       Logger.error(err);
    //     }

    //     return err;
    //   }).then(async (results)=>{
    //     await this.currentSuite.terminate(results ? '': 'FAILED');

    //     return this.currentSuite.testSuiteFinished(!results);
    //   });
    
     
     
  
    

  }

  /**
   *
   * @param {Array} testEnvArray
   * @param {Array} modules
   * @return {Promise<number>}
   */
  async runConcurrent(testEnvArray, modules) {
    this.concurrency = new Concurrency(this.settings, this.argv);
    this.globalReporter.setupChildProcessListener(this.concurrency);

    const exitCode = await this.concurrency.runMultiple(testEnvArray, modules);
    await this.reportResults();

    return exitCode;
  }

  isTestWorker() {
    return Concurrency.isTestWorker(this.argv);
  }
}

module.exports = CucumberRunnner;
