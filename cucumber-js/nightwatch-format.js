const fs = require('fs');
const path = require('path');
const Utils = require('../lib/utils');
const {Logger, createFolder} = Utils;
const {Formatter} = require('@cucumber/cucumber');

const NightwatchState = require('./nightwatchState');
const {NightwatchEventHub, CUCUMBER_RUNNER_EVENTS: {
  TestStarted, 
  TestFinished,
  TestCaseStarted,
  TestCaseFinished,
  TestStepStarted,
  TestStepFinished
}} = require('../lib/runner/eventHub');

module.exports = class MessageFormatter extends Formatter {
  constructor(options) {
    super(options);

    this.report = {};

    options.eventBroadcaster.on('envelope', (envelope) => {
      if (NightwatchState.client && !this.client) {
        this.client = NightwatchState.client;
        this.browser = NightwatchState.browser;
        this.setCapabilities();
      }
      
      this.reportHandler(envelope);
    });
  }

  setCapabilities() {
    this.report = {
      ...this.report,
      seleniumLogs: this.client?.transport?.driverService?.getSeleniumOutputFilePath(),
      sessionCapabilities: this.browser?.capabilities,
      sessionId: this.browser?.sessionId
    };
  }

  onMeta(meta) {
    this.report.metadata = meta;
  }

  onGherkinDocument(gherkinDocument) {
    this.report.gherkinDocument = gherkinDocument;
  }

  onParseError(parseError) {
    this.report.error = [...(this.report.error || []), parseError];;
  }

  onPickle(pickle) {
    this.report.pickle = [...(this.report.pickle || []), pickle];
  }

  onSource(source) {
    this.report.source = source;
  }

  onStepDefinition(stepDefinition) {
    this.report.stepDefinition = [...(this.report.stepDefinition || []), stepDefinition];
  }

  onTestCase(testCase) {
    this.report.testCases = [...(this.report.testCases || []), testCase];
  }

  onTestCaseFinished(result) {
    result.httpOutput = Logger.collectTestSectionOutput();

    this.report.testCaseFinished = result;

    NightwatchEventHub.emit(TestCaseFinished, {
      envelope: result,
      report: this.report
    });
  }

  onTestCaseStarted(result) {
    this.report.testCaseStarted = result;

    NightwatchEventHub.emit(TestCaseStarted, {
      envelope: result,
      report: this.report
    });
  }

  onTestRunFinished(result) {
    result.httpOutput = Logger.collectOutput();
    this.report.testRunFinished = result;

    NightwatchEventHub.emit(TestFinished, {
      envelope: result,
      report: this.report
    });

    let {output_folder} = this.client.settings;
    output_folder = path.join(output_folder, 'cucumber');
    const filename = path.join(output_folder, 'cucumber-report.json');

    this.writeReportFile(filename, JSON.stringify(this.report, null, 2), true, output_folder)
      .then(_ => {
        Logger.info(Logger.colors.stack_trace(`Wrote JSON report file to: ${path.resolve(filename)}`));
      });
  }

  writeReportFile(filename, rendered, shouldCreateFolder, output_folder) {
    (shouldCreateFolder ? createFolder(output_folder) : Promise.resolve())
      .then(() => {
        return new Promise((resolve, reject) => {
          fs.writeFile(filename, rendered, function(err) {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      });
  }

  onTestRunStarted(result) {
    this.report.testRunStarted = result;

    NightwatchEventHub.emit(TestStarted, {
      envelope: result,
      report: this.report
    }
    );
  }

  onTestStepFinished(result) {
    result.httpOutput = Logger.collectCommandOutput();
    this.report.testStepFinished = result;

    NightwatchEventHub.emit(TestStepFinished, {
      envelope: result,
      report: this.report
    });
  }

  onTestStepStarted(result) {
    this.report.testStepStarted = result;

    NightwatchEventHub.emit(TestStepStarted, {
      envelope: result,
      report: this.report
    });
  }

  reportHandler(envelope) {
    if (!NightwatchEventHub.isAvailable) {
      return;
    }

    const handlers = {
      meta: this.onMeta,
      gherkinDocument: this.onGherkinDocument,
      parseError: this.onParseError,
      pickle: this.onPickle,
      source: this.onSource,
      stepDefinition: this.onStepDefinition,
      testCase: this.onTestCase,
      testCaseFinished: this.onTestCaseFinished,
      testCaseStarted: this.onTestCaseStarted,
      testRunFinished: this.onTestRunFinished,
      testRunStarted: this.onTestRunStarted,
      testStepFinished: this.onTestStepFinished,
      testStepStarted: this.onTestStepStarted
    };
  
    const cucumberEvent = Object.keys(envelope)[0];
    if (cucumberEvent && handlers[cucumberEvent]) {
      handlers[cucumberEvent].call(this, envelope[cucumberEvent]);
    }
  }
};
