const EventEmitter = require('events');

class NightwatchEventHub extends EventEmitter {
  emit({eventName, ...data}) {
    super.emit(eventName, data);
  }

  get isAvailable() {
    return this.eventFnExist;
  }

  set isAvailable(eventFnExist) {
    this.eventFnExist = eventFnExist;
  }

  set runner(type) {
    this.runnerType = type;
  }

  get runner() {
    return this.runnerType;
  }
}

const instance = new NightwatchEventHub();

module.exports = {
  NightwatchEventHub: instance,
  COMMON_EVENTS: {
    ScreenshotCreated: 'ScreenshotCreated'
  },
  DEFAULT_RUNNER_EVENTS: {
    GlobalHookRunStarted: 'GlobalHookRunStarted',
    GlobalHookRunFinished: 'GlobalHookRunFinished',
    TestSuiteStarted: 'TestSuiteStarted',
    TestSuiteFinished: 'TestSuiteFinished',
    HookRunStarted: 'HookRunStarted',
    HookRunFinished: 'HookRunFinished',
    TestRunStarted: 'TestRunStarted',
    TestRunFinished: 'TestRunFinished',
    LogCreated: 'LogCreated'
  },
  CUCUMBER_RUNNER_EVENTS: {
    TestStarted: 'TestStarted',
    TestFinished: 'TestFinished',
    TestCaseStarted: 'TestCaseStarted',
    TestCaseFinished: 'TestCaseFinished',
    TestStepStarted: 'TestStepStarted',
    TestStepFinished: 'TestStepFinished'
  }
};
