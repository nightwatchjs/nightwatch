const EventEmitter = require('events');
const CommandQueue = require('./queue.js');
const Reporter = require('./reporter.js');
const Logger = require('../util/logger.js');

class Session extends EventEmitter {
  static get DEFAULT_CAPABILITIES() {
    return {
      browserName: 'firefox',
      acceptSslCerts: true,
      platform: 'ANY'
    }
  }

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
    this.options = opts;
    this.sessionId = 0;
    this.__is_terminated = false;
    this.__protocol = null;
    this.__commandQueue = new CommandQueue();
    this.desiredCapabilities();
    this.resetQueue();
  }

  get commandQueue() {
    return this.__commandQueue;
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

  getSessionId() {
    return this.__sessionId;
  }

  set sessionId(val) {
    this.__sessionId = val;
  }

  set terminated(val) {
    this.__is_terminated = val;
  }

  resetQueue() {
    this.commandQueue.empty().reset();

    return this;
  }

  desiredCapabilities() {
    this.desiredCapabilities = Object.assign({}, Session.DEFAULT_CAPABILITIES);

    Object.assign(this.desiredCapabilities, this.options.desiredCapabilities);

    return this;
  }

  setTransportProtocol(protocol) {
    this.__protocol = protocol;

    return this;
  }

  finished(reason) {
    this.clear();
    this.emit('session:finished', reason);

    return this;
  }

  clear() {
    this.sessionId = null;
    this.capabilities = {};
  }

  /**
   *
   * @return {Promise}
   */
  create() {
    if (!this.startSessionEnabled) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.transportProtocol.once('transport:session.error', (err) => {
        reject(err);
      }).once('transport:session.create', (data, req, res) => {
        this.sessionId = data.sessionId;
        this.capabilities = data.capabilities;

        resolve(data);
      }).createSession();
    });
  }

  close(reason) {
    if (!this.startSessionEnabled) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.transportProtocol.once('transport:session.error', (err) => {
        reject(err);
      }).once('transport:session.destroy', (data) => {
        this.finished(reason);

        resolve(data);
      }).closeSession(this.getSessionId());
    });
  }

  ////////////////////////////////////////////////////////////////////////////
  // OLD STUFF
  ////////////////////////////////////////////////////////////////////////////
  /**
   * @deprecated
   * @return {Session}
   */
  start() {
    throw new Error('Session.start() has been deprecated.');

    if (!this.getSessionId() && this.startSessionEnabled) {
      this.createSession().then(this.start.bind(this));

      return this;
    }

    this.commandQueue.reset().run(error => {
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
   * @returns {Session}
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

    if (this.endSessionOnFail && this.startSessionEnabled && this.getSessionId()) {
      this.transportProtocol.closeSession(this.getSessionId())
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
}

module.exports = Session;

