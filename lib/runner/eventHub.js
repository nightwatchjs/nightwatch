const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const {Logger, createFolder} = require('../utils');

class NightwatchEventHub extends EventEmitter {
  emit(eventName, data) {
    if (this.isAvailable) {
      try {
        super.emit(eventName, data);
      } catch (err) {
        Logger.error(err);
      }
    }

    if (eventName === 'TestFinished' && this.output_folder && this.runner === 'cucumber') {
      let {output_folder} = this;
      output_folder = path.join(output_folder, 'cucumber');
      const filename = path.join(output_folder, 'cucumber-report.json');

      this.writeReportFile(filename, JSON.stringify(data.report, null, 2), true, output_folder)
        .then(_ => {
          Logger.info(Logger.colors.stack_trace(`Wrote JSON report file to: ${path.resolve(filename)}`));
        });
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

  writeReportFile(filename, rendered, shouldCreateFolder, output_folder) {
    return (shouldCreateFolder ? createFolder(output_folder) : Promise.resolve())
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
