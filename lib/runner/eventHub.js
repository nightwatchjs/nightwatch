const EventEmitter = require('events');

class NightwatchEventHub extends EventEmitter {
  emit(eventName, data) {
    if (this.isAvailable) {
      super.emit(eventName, data);
    }
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
    GlobalHook: {
      before: {
        started: 'GlobalBeforeStarted',
        finished: 'GlobalBeforeFinished'
      },
  
      beforeChildProcess: {
        started: 'GlobalBeforeChildProcessStarted',
        finished: 'GlobalBeforeChildProcessFinished'
      },
  
      beforeEach: {
        started: 'GlobalBeforeEachStarted',
        finished: 'GlobalBeforeEachFinished'
      },
  
      afterEach: {
        started: 'GlobalAfterEachStarted',
        finished: 'GlobalAfterEachFinished'
      },
  
      afterChildProcess: {
        started: 'GlobalAfterChildProcessStarted',
        finished: 'GlobalAfterChildProcessFinished'
      },
  
      after: {
        started: 'GlobalAfterStarted',
        finished: 'GlobalAfterFinished'
      }
    },

    TestSuiteHook: {
      started: 'TestSuiteStarted',
      finished: 'TestSuiteFinished',
      
      before: {
        started: 'BeforeStarted',
        finished: 'BeforeFinished'
      },

      beforeEach: {
        started: 'BeforeEachStarted',
        finished: 'BeforeEachFinished'
      },

      test: {
        started: 'TestRunStarted',
        finished: 'TestRunFinished'
      },
  
      afterEach: {
        started: 'AfterEachStarted',
        finished: 'AfterEachFinished'
      },

      after: {
        started: 'AfterStarted',
        finished: 'AfterFinished'
      }
    },

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
