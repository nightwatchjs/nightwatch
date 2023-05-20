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
}

const instance = new NightwatchEventHub();

module.exports = {
  NightwatchEventHub: instance,
  USER_EVENTS: {
    GlobalHookRunStarted: 'GlobalHookRunStarted',
    GlobalHookRunFinished: 'GlobalHookRunFinished',
    TestSuiteStarted: 'TestSuiteStarted',
    TestSuiteFinished: 'TestSuiteFinished',
    HookRunStarted: 'HookRunStarted',
    HookRunFinished: 'HookRunFinished',
    TestRunStarted: 'TestRunStarted',
    TestRunFinished: 'TestRunFinished',
    LogCreated: 'LogCreated',
    ScreenshotCreated: 'ScreenshotCreated'
  },
  CUCUMBER_USER_EVENTS: {
    TestRunStarted: 'TestRunStarted',
    TestRunFinished: 'TestRunFinished',
    TestCaseStarted: 'TestCaseStarted',
    TestCaseFinished: 'TestCaseFinished',
    TestStepStarted: 'TestStepStarted',
    TestStepFinished: 'TestStepFinished'
  }
};