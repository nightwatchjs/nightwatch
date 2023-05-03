const EventEmitter = require('events');
const GlobalNwEvent = 'GlobalNwEvent';

class NightwatchEventHub extends EventEmitter {
  constructor(onEventFn) {
    super();
    this.onEventFn = onEventFn;
    this.on(GlobalNwEvent, this.onEventFn);
  }

  emit(data) {
    super.emit(GlobalNwEvent, data);
  }
}

module.exports = {
  NightwatchEventHub,
  USER_EVENTS: {
    GlobalHookRunStarted: 'GlobalHookRunStarted',
    GlobalHookRunFinished: 'GlobalHookRunFinished',
    TestSuiteStarted: 'TestSuiteStarted',
    TestSuiteFinished: 'TestSuiteFinished',
    HookRunStarted: 'HookRunStarted',
    HookRunFinished: 'HookRunFinished',
    TestRunStarted: 'TestRunStarted',
    TestRunFinished: 'TestRunFinished'
  }
};
