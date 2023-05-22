const EventEmitter = require('events');
const Utils = require('../utils');
const GlobalNwEvent = 'GlobalNwEvent';


class NightwatchEventHub extends EventEmitter {
  setOnEventFunction(onEventFn) {
    this.onEventFn = onEventFn;
    this.on(GlobalNwEvent, this.onEventFn);
  }

  emit(data) {
    super.emit(GlobalNwEvent, data);
  }

  get isAvailable() {
    return Utils.isFunction(this.onEventFn);
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
