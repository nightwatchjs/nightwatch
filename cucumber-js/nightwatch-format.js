const fs = require('fs');
const path = require('path');
const Utils = require('../lib/utils');
const {Logger} = Utils;
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

  metaData(meta) {
    this.report.metadata = meta;
  }

  gherkinDocumentData(gherkinDocument) {
    this.report.gherkinDocument = [...(this.report.gherkinDocument || []), gherkinDocument];
  }

  parseErrorData(parseError) {
    this.report.error = [...(this.report.parseError || []), parseError];
  }

  pickleData(pickle) {
    this.report.pickle = [...(this.report.pickle || []), pickle];
  }

  sourceData(source) {
    this.report.source = [...(this.report.source || []), source];
  }

  stepDefinitionData(stepDefinition) {
    this.report.stepDefinitions = [...(this.report.stepDefinition || []), stepDefinition];
  }

  testCaseData(testCase) {
    this.report.testCases = [...(this.report.testCase || []), testCase];
  }

  testCaseFinishedData(result) {
    result.httpOutput = Logger.collectTestSectionOutput();

    this.report.testCaseFinished = [...(this.report.testCaseFinished || []), result];

    NightwatchEventHub.emit(TestCaseFinished, {
      envelope: result,
      report: this.report
    });
  }

  testCaseStartedData(result) {
    this.report.testCaseStarted = [...(this.report.testCaseStarted || []), result];;

    NightwatchEventHub.emit(TestCaseStarted, {
      envelope: result,
      report: this.report
    });
  }

  testRunFinishedData(result) {
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
    (shouldCreateFolder ? Utils.createFolder(output_folder) : Promise.resolve())
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

  testRunStartedData(result) {
    this.report.testRunStarted = result;

    NightwatchEventHub.emit(TestStarted, {
      envelope: result,
      report: this.report
    }
    );
  }

  testStepFinishedData(result) {
    result.httpOutput = Logger.collectCommandOutput();
    this.report.testStepFinished = [...(this.report.testStepFinished || []), result];;

    NightwatchEventHub.emit(TestStepFinished, {
      envelope: result,
      report: this.report
    });
  }

  testStepStartedData(result) {
    this.report.testStepStarted = [...(this.report.testStepStarted || []), result];;

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
      meta: this.metaData,
      gherkinDocument: this.gherkinDocumentData,
      parseError: this.parseErrorData,
      pickle: this.pickleData,
      source: this.sourceData,
      stepDefinition: this.stepDefinitionData,
      testCase: this.testCaseData,
      testCaseFinished: this.testCaseFinishedData,
      testCaseStarted: this.testCaseStartedData,
      testRunFinished: this.testRunFinishedData,
      testRunStarted: this.testRunStartedData,
      testStepFinished: this.testStepFinishedData,
      testStepStarted: this.testStepStartedData
    };
  
    const key = Object.keys(envelope)[0];
    if (handlers[key]) {
      handlers[key].call(this, envelope[key]);
    }
  }
};
