const EventEmitter = require('events');
const CommandQueue = require('./queue.js');
const Reporter = require('./reporter.js');
const Logger = require('../util/logger.js');

module.exports = class Session extends EventEmitter {
  constructor(opts = {}) {
    super();
/*
    this.errors = [];
    this.results = {
      passed: 0,
      failed: 0,
      errors: 0,
      skipped: 0,
      tests: []
    };
*/
    this.sessionId = null;
    this.options = opts;
    this.__is_terminated = false;
    this.__protocol = null;

    this.resetQueue();
  }

  static get commandQueue() {
    return CommandQueue;
  }

  get terminated() {
    return this.__is_terminated;
  }

  get transportProtocol() {
    return this.__protocol;
  }

  get startSessionEnabled() {
    return this.options.start_session;
  }

  get endSessionOnFail() {
    return this.options.end_session_on_fail;
  }

  set terminated(val) {
    this.__is_terminated = val;
  }

  resetQueue() {
    Session.commandQueue.empty();
    Session.commandQueue.reset();
  }

  setTransportProtocol(protocol) {
    this.__protocol = protocol;

    return this;
  }

  start() {
    if (!this.sessionId && this.startSessionEnabled) {
      this.createSession(this.start);

      return this;
    }

    Session.commandQueue.reset();

    Session.commandQueue.run(error => {
      if (error) {
        Reporter.incrementErrorsNo();
        Reporter.printGlobalError(error);

        if (this.startSessionEnabled) {
          this.terminateSession();
        }

        return;
      }

      this.finished();
    });

    return this;
  }

  /**
   * @deprecated
   * @param deferred
   * @returns {module.Session}
   */
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
    this.resetQueue();

    if (this.endSessionOnFail && this.startSessionEnabled && this.sessionId) {
      this.transportProtocol.terminateSession(this.sessionId)
        .once('transport:session.destroy', response => {
          this.finished();
        });

      // FIXME: sometimes the queue is incorrectly restarted when another .end() is
      // scheduled from globalBeforeEach and results into a session command being sent with
      // null as the sessionId
    } else {
      this.finished();
    }

    return this;
  }

  finished() {
    this.clear();
    this.emit('session:finished');

    return this;
  }

  clear() {
    this.sessionId = null;
    this.capabilities = {};
  }

  createSession(cb) {
    if (this.terminated) {
      return this;
    }

    this.transportProtocol.on('transport:session.error', (message, data) => {
      this.emit('session:error', message, data);
    }).on('transport:session.create', (data, req, res) => {
      this.sessionId = data.sessionId;
      this.capabilities = data.capabilities;

      this.emit('session:create', data);

      cb.call(this);

    }).createSession();

    return this;
  }
/*
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
*/
  handleException(err) {
    Reporter.handleTestException(err, this.terminate.bind(this));
  }
/*
  clearResult() {
    this.errors.length = 0;
    this.results.passed = 0;
    this.results.failed = 0;
    this.results.errors = 0;
    this.results.skipped = 0;
    this.results.tests.length = 0;
  }
*/
  printResult(elapsedTime) {
    if (Logger.isOutputEnabled() && this.startSessionEnabled) {
      Reporter.printResult(elapsedTime, this.startSessionEnabled);
    }
  }
/*
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
  */
};

