const EventEmitter = require('events');
const CommandQueue = require('./queue.js');

class Session extends EventEmitter {
  static get DEFAULT_CAPABILITIES() {
    return {
      browserName: 'firefox',
      acceptSslCerts: true,
      platform: 'ANY'
    };
  }

  constructor(opts = {}) {
    super();

    this.options = opts;
    this.sessionId = 0;
    this.__protocol = null;

    this.setDesiredCapabilities();
    this.createCommandQueue();
  }

  get commandQueue() {
    return this.__commandQueue;
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

  createCommandQueue() {
    this.__commandQueue = new CommandQueue();
  }

  setDesiredCapabilities() {
    this.desiredCapabilities = Object.assign({}, Session.DEFAULT_CAPABILITIES);

    Object.assign(this.desiredCapabilities, this.options.desiredCapabilities);

    return this;
  }

  setTransportProtocol(protocol) {
    this.__protocol = protocol;

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

    return this.transportProtocol.closeSession()
      .then(data => {
        this.finished(reason);

        return data;
      });
  }
}

module.exports = Session;

