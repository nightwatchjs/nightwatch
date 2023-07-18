const Utils = require('../../../utils');
const {Logger, SafeJSON, isFunction} = Utils;
const {Formatter} = require('@cucumber/cucumber');

const {NightwatchEventHub, CUCUMBER_RUNNER_EVENTS: {
  TestStarted, 
  TestFinished,
  TestCaseStarted,
  TestCaseFinished,
  TestStepStarted,
  TestStepFinished
}} = require('../../eventHub.js');

module.exports = class NightwatchFormatter extends Formatter {
  constructor(options) {
    super(options);

    this.report = {};

    NightwatchFormatter.eventBroadcaster = options.eventBroadcaster;

    options.eventBroadcaster.on('envelope', (envelope) => {
      if (envelope.sessionId && (!this.report.sessionId || envelope.sessionId !== this.report.sessionId)) {
        this.report = {
          ...this.report,
          ...envelope
        };
      }

      this.reportHandler(envelope);
    });
  }

  static setCapabilities(data) {
    if (isFunction(process.send)) {
      process.send({'jsonEnvelope': SafeJSON.stringify(data)});
    } else {
      NightwatchFormatter.eventBroadcaster?.emit('envelope', data);
    }
  }

  onMeta(meta) {
    this.report.metadata = meta;
  }

  onGherkinDocument(gherkinDocument) {
    this.report.gherkinDocument = [...(this.report.gherkinDocument || []), gherkinDocument];
  }

  onParseError(parseError) {
    this.report.error = [...(this.report.error || []), parseError];;
  }

  onPickle(pickle) {
    this.report.pickle = [...(this.report.pickle || []), pickle];
  }

  onHook(hook) {
    this.report.hooks = [...(this.report.hooks || []), hook];
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

    this.report.testCaseFinished = this.report.testCaseFinished || {};
    this.report.testCaseFinished[result.testCaseStartedId] = result;

    NightwatchEventHub.emit(TestCaseFinished, {
      envelope: result,
      report: this.report
    });
  }

  onTestCaseStarted(result) {
    this.report.testCaseStarted = this.report.testCaseStarted || {};
    this.report.testCaseStarted[result.id] = result;

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
  }

  onTestRunStarted(result) {
    this.report.testRunStarted = result;

    NightwatchEventHub.emit(TestStarted, {
      envelope: result,
      report: this.report
    });
  }

  onTestStepFinished(result) {
    result.httpOutput = Logger.collectCommandOutput();
    this.report.testStepFinished = this.report.testStepFinished || {};
    this.report.testStepFinished[result.testCaseStartedId] = result;

    NightwatchEventHub.emit(TestStepFinished, {
      envelope: result,
      report: this.report
    });
  }

  onTestStepStarted(result) {
    this.report.testStepStarted = this.report.testStepStarted || {};
    this.report.testStepStarted[result.testCaseStartedId] = result;

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
      hook: this.onHook,
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
