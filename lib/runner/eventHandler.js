const EventEmitter = require('events');

class NightwatchEventHandler extends EventEmitter {
  constructor(onEventFn) {
    super();
    this.onEventFn = onEventFn;
    this.init();
  }

  setEventsList() {
    this.nwEvents = {
      SubscribeNwEvents: 'SubscribeNwEvents'
    };

    this.userEvents = {
      GlobalHookRunStarted: 'GlobalHookRunStarted',
      GlobalHookRunFinished: 'GlobalHookRunFinished',
      TestSuiteStarted: 'TestSuiteStarted',
      TestSuiteFinished: 'TestSuiteFinished',
      HookRunStarted: 'HookRunStarted',
      HookRunFinished: 'HookRunFinished',
      TestRunStarted: 'TestRunStarted',
      TestRunFinished: 'TestRunFinished'
    };
  }

  subscribeNightwatchEvents() {
    super.on(this.nwEvents.SubscribeNwEvents, this.onEventFn);
  }

  init() {
    this.setEventsList();
    this.subscribeNightwatchEvents();
  }

  emit(data) {
    super.emit(this.nwEvents.SubscribeNwEvents, data);
  }
}

module.exports = NightwatchEventHandler;
