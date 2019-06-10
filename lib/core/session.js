const EventEmitter = require('events');
const CommandQueue = require('./queue.js');
const BrowserName = require('../util/browsername.js');

class Session extends EventEmitter {
  static get DEFAULT_CAPABILITIES() {
    return {
      browserName: BrowserName.FIREFOX,
      acceptSslCerts: true,
      platform: 'ANY'
    };
  }

  constructor(nightwatchInstance) {
    super();

    this.settings = nightwatchInstance.settings;
    this.sessionId = 0;

    this.__protocol = nightwatchInstance.transport;

    this.setDesiredCapabilities();
    this.createCommandQueue();
  }

  get commandQueue() {
    return this.__commandQueue;
  }

  get transport() {
    return this.__protocol;
  }

  get startSessionEnabled() {
    return this.settings.start_session;
  }

  get endSessionOnFail() {
    return this.settings.end_session_on_fail;
  }

  getSessionId() {
    return this.__sessionId;
  }

  set sessionId(val) {
    this.__sessionId = val;
  }

  createCommandQueue() {
    this.__commandQueue = new CommandQueue();
  }

  setDesiredCapabilities() {
    this.desiredCapabilities = Object.assign({}, Session.DEFAULT_CAPABILITIES);

    Object.assign(this.desiredCapabilities, this.settings.desiredCapabilities);

    return this;
  }

  finished(reason) {
    this.clearSession();
    this.emit('session:finished', reason);

    return this;
  }

  clearSession() {
    this.sessionId = null;
    this.capabilities = {};
  }

  /**
   *
   * @return {Promise}
   */
  create() {
    return new Promise((resolve, reject) => {
      this.transport.once('transport:session.error', (err) => {
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

    return this.transport.closeSession()
      .then(data => {
        this.finished(reason);

        return data;
      });
  }
}

module.exports = Session;

