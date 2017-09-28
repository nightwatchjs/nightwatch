const events = require('events');
const CommandQueue = require('../core/queue.js');
const Utils = require('../util/utils.js');

class Session extends events.EventEmitter {
  constructor(opts = {}) {
    super();

    this.errors = [];
    this.results = {
      passed: 0,
      failed: 0,
      errors: 0,
      skipped: 0,
      tests: []
    };

    this.sessionId = null;
    this.options = opts;
    this.terminated = false;

    this.queue = CommandQueue;
    this.queue.empty();
    this.queue.reset();
  }

  start() {
    if (!this.sessionId && this.options.start_session) {
      this
        .once('selenium:session_create', this.start)
        .createSession();
      return this;
    }

    this.queue.reset();
    this.queue.run(error => {
      if (error) {
        let stackTrace = '';
        if (error.stack) {
          stackTrace = error.stack.split('\n').slice(1).join('\n');
        }

        this.results.errors++;
        this.errors.push(error.name + ': ' + error.message + '\n' + stackTrace);
        if (this.options.output) {
          Utils.showStackTraceWithHeadline(error.name + ': ' + error.message, stackTrace, true);
        }

        if (this.options.start_session) {
          this.terminate();
        }
        return;
      }

      this.finished();
    });

    return this;
  }

  terminate(deferred) {
    // in case this was a synchronous command (e.g. assert.ok()) we need to wait for other possible
    // commands which might have been added afterwards while client is terminated
    if (deferred) {
      this.queue.instance().once('queue:started', this.terminateSession.bind(this));
    } else {
      this.terminateSession();
    }

    this.terminated = true;
    return this;
  }

  resetTerminated() {
    this.terminated = false;
    return this;
  }

  terminateSession() {
    this.queue.reset();
    this.queue.empty();

    if (this.options.end_session_on_fail && this.options.start_session) {
      this.api.end(() =>{
        this.finished();
      });

      // FIXME: sometimes the queue is incorrectly restarted when another .end() is
      // scheduled from globalBeforeEach and results into a session command being sent with
      // null as the sessionId
      this.queue.run();
    } else {
      this.finished();
    }
    return this;
  }

  finished() {
    this.emit('nightwatch:finished', this.results, this.errors);

    return this;
  }

  createSession() {
    if (this.terminated) {
      return this;
    }

    let options = {
      path : '/session',
      data : {
        desiredCapabilities : this.desiredCapabilities
      }
    };

    var request = new HttpRequest(options);
    request.on('success', function(data, response, isRedirect) {
      if (data && data.sessionId) {
        self.sessionId = self.api.sessionId = data.sessionId;
        if (data.value) {
          self.api.capabilities = data.value;
        }

        self.emit('selenium:session_create', self.sessionId, request, response);
      } else if (isRedirect) {
        self.followRedirect(request, response);
      } else {
        request.emit('error', data, null);
      }
    })
      .on('error', function(data, err) {
        if (self.options.output) {
          console.error('\n' + Logger.colors.light_red('Error retrieving a new session from the selenium server'));
        }

        if (typeof data == 'object' && Object.keys(data).length === 0) {
          data = '';
        }

        if (!data && err) {
          data = err;
        }

        self.emit('error', data);
      })
      .send();

    return this;
  }

  handleTestError(result) {
    var errorMessage = '';
    if (result && result.status) {
      var errorCodes = require('./api/errors.json');
      errorMessage = errorCodes[result.status] && errorCodes[result.status].message || '';
    }

    return {
      status: -1,
      value : result && result.value || null,
      errorStatus: result && result.status || '',
      error : errorMessage
    };
  }

  addError(message, logMessage) {
    var currentTest;
    if (this.api.currentTest) {
      currentTest = '[' + Utils.getTestSuiteName(this.api.currentTest.module) + ' / ' + this.api.currentTest.name + ']';
    } else {
      currentTest = 'tests';
    }

    this.errors.push('  Error while running '+ currentTest  + ':\n' + message);
    this.results.errors++;
    if (this.options.output) {
      Logger.warn('    ' + (logMessage || message));
    }
  }

  handleException(err) {
    var stack = err.stack.split('\n');
    var failMessage = stack.shift();
    var firstLine = ' ' + String.fromCharCode(10006) + ' ' + failMessage;
    if (typeof err.actual != 'undefined' && typeof err.expected != 'undefined') {
      firstLine += '\033[0;90m - expected ' + Logger.colors.green('"' + err.expected + '"') + ' \033[0;90mbut got: ' + Logger.colors.red('"' + err.actual + '"');
    }

    if (this.options.output) {
      Utils.showStackTraceWithHeadline(firstLine, stack);
    }

    if (err.name == 'AssertionError') {
      this.results.failed++;
      stack.unshift(failMessage + ' - expected "' + err.expected + '" but got: "' + err.actual + '"');
      this.results.stackTrace = stack.join('\n');
    } else {
      this.addError('\n  ' + err.stack, firstLine);
      this.terminate();
    }
  }

  clearResult() {
    this.errors.length = 0;
    this.results.passed = 0;
    this.results.failed = 0;
    this.results.errors = 0;
    this.results.skipped = 0;
    this.results.tests.length = 0;
  }

  printResult(elapsedTime) {
    if (this.options.output && this.options.start_session) {
      var ok = false;
      if (this.results.failed === 0 && this.results.errors === 0) {
        ok = true;
      }

      if (ok && this.results.passed > 0) {
        console.log('\n' + Logger.colors.green('OK.'),
          Logger.colors.green(this.results.passed) + ' assertions passed. (' + Utils.formatElapsedTime(elapsedTime, true) + ')');
      } else if (ok && this.results.passed === 0) {
        if (this.options.start_session) {
          console.log(Logger.colors.green('No assertions ran.'));
        }
      } else {
        var failure_msg = this.getFailureMessage();
        console.log('\n' +  Logger.colors.red('FAILED: '), failure_msg, '(' + Utils.formatElapsedTime(elapsedTime, true) + ')');
      }
    }
  }

  getFailureMessage() {
    var errors = '';

    var failure_msg = [];
    if (this.results.failed > 0) {
      failure_msg.push(Logger.colors.red(this.results.failed) +
        ' assertions failed');
    }
    if (this.results.errors > 0) {
      failure_msg.push(Logger.colors.red(this.results.errors) + ' errors');
    }
    if (this.results.passed > 0) {
      failure_msg.push(Logger.colors.green(this.results.passed) + ' passed');
    }

    if (this.results.skipped > 0) {
      failure_msg.push(Logger.colors.blue(this.results.skipped) + ' skipped');
    }

    return failure_msg.join(', ').replace(/,([^,]*)$/g, function($0, $1) {
      return  ' and' + $1;
    });
  }
}