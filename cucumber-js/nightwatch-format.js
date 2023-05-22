const {Formatter} = require('@cucumber/cucumber');
const {NightwatchEventHub, CUCUMBER_USER_EVENTS: {
  TestRunStarted, 
  TestRunFinished,
  TestCaseStarted,
  TestCaseFinished,
  TestStepStarted,
  TestStepFinished
}} = require('../lib/runner/eventHub');
const NightwatchState = require('./nightwatchState');
const Utils = require('../lib/utils');
const {Logger} = Utils;

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
      seleniumLogs: this.client.transport.driverService.getSeleniumOutputFilePath(),
      sessionCapabilities: this.browser.capabilities,
      sessionId: this.browser.sessionId
    };
  }

  metaData(meta) {
    this.report.metadata = meta;
  }

  gherkinDocumentData(gherkinDocument) {
    this.report.gherkinDocument = gherkinDocument;
  }

  parseErrorData(parseError) {
    this.report.error = [...(this.report.parseError || []), parseError];
  }

  pickleData(pickle) {
    this.report.pickle = pickle;
  }

  sourceData(source) {
    this.report.source = source;
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

    NightwatchEventHub.emit({
      eventName: TestCaseFinished,
      envelope: result,
      report: this.report
    });
  }

  testCaseStartedData(result) {
    this.report.testCaseStarted = [...(this.report.testCaseStarted || []), result];;

    NightwatchEventHub.emit({
      eventName: TestCaseStarted,
      envelope: result,
      report: this.report
    });
  }

  testRunFinishedData(result) {
    result.httpOutput = Logger.collectOutput();
    this.report.testRunFinished = result;

    NightwatchEventHub.emit({
      eventName: TestRunFinished,
      envelope: result,
      report: this.report
    });
  }

  testRunStartedData(result) {
    this.report.testRunStarted = result;

    NightwatchEventHub.emit({
      eventName: TestRunStarted,
      envelope: result,
      report: this.report
    });
  }

  testStepFinishedData(result) {
    result.httpOutput = Logger.collectCommandOutput();
    this.report.testStepFinished = [...(this.report.testStepFinished || []), result];;

    NightwatchEventHub.emit({
      eventName: TestStepFinished,
      envelope: result,
      report: this.report
    });
  }

  testStepStartedData(result) {
    this.report.testStepStarted = [...(this.report.testStepStarted || []), result];;

    NightwatchEventHub.emit({
      eventName: TestStepStarted,
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
