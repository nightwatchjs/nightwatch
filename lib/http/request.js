const events = require('events');
const http   = require('http');
const https  = require('https');
const HttpUtil = require('./http.js');
const Auth = require('./auth.js');
const Formatter = require('./formatter.js');
const HttpResponse = require('./response.js');

let __defaultSettings__ = {
  selenium_host  : 'localhost',
  selenium_port  : 4444,
  default_path   : '/wd/hub',
  credentials    : null,
  use_ssl        : false,
  proxy          : null,
  timeout        : 60000,
  retry_attempts : 0
};

let __globalSettings__ = {};

class HttpRequest extends events.EventEmitter {
  constructor(opts) {
    super();

    this.__settings = null;
    this.isAborted = false;
    this.httpRequest = null;
    this.response    = null;

    this.httpOpts = null;
    this.setOptions(opts);
  }

  static set globalSettings(val) {
    __globalSettings__ = Object.assign({}, val);
  }

  static get globalSettings() {
    return __globalSettings__;
  }

  set httpOpts(val) {
    this.__settings = Object.assign({}, __defaultSettings__, __globalSettings__, val);
  }

  get httpOpts(val) {
    return this.__settings;
  }

  get socket() {
    return this.httpRequest.socket;
  }

  setOptions(options) {
    this.data           = options.data && Formatter.jsonStringify(options.data) || '';
    this.contentLength  = this.data.length;
    this.reqOptions     = this.createOptions(options);
    this.hostname       = Formatter.formatHostname(this.reqOptions.host, this.reqOptions.port, this.httpOpts.use_ssl);
    this.retryAttempts  = this.httpOpts.retry_attempts;

    this
      .setPathPrefix(options)
      .addHeaders()
      .addProxyIfNeeded();

    return this;
  }

  setPathPrefix(options) {
    this.defaultPathPrefix = options.path && options.path.indexOf(this.httpOpts.default_path) === -1 ?
      this.httpOpts.default_path : '';

    return this;
  }

  createOptions(options) {
    let reqOptions = {
      path    : this.defaultPathPrefix + (options.path || ''),
      host    : options.host || this.httpOpts.selenium_host,
      port    : options.port || this.httpOpts.selenium_port,
      method  : options.method && options.method.toUpperCase() || 'POST',
      headers : {}
    };

    if (options.sessionId) {
      reqOptions.path = reqOptions.path.replace(':sessionId', options.sessionId);
    }

    return reqOptions;
  }

  createHttpRequest() {
    let req = (this.httpOpts.use_ssl ? https: http).request(this.reqOptions, response => {
      this.response = new HttpResponse(response, this);
      this.response.on('beforeResult', result => {
        this.emit('beforeResult', result);
      })
    });

    this.addAuthorizationIfNeeded(req);

    return req;
  }

  send() {
    this.startTime = new Date();
    this.isAborted = false;

    this.emit('send', {
      method: this.reqOptions.method,
      hostname: this.hostname,
      path: this.reqOptions.path,
      data: this.data,
      headers: this.reqOptions.headers
    });

    this.httpRequest = this.createHttpRequest();

    this.httpRequest.on('error', err => {
      this.emit('error', err);
    });

    this.httpRequest.setTimeout(this.httpOpts.timeout, () => {
      if (this.retryAttempts) {
        this.socket.unref();
        this.isAborted = true; // prevent emitting of the success event multiple times.
        this.retryAttempts = this.retryAttempts - 1;
        this.send();
      } else {
        this.httpRequest.abort();
      }
    });

    /*
    Logger.info(`Request: ${this.reqOptions.method} ${this.hostname} ${this.reqOptions.path} \n
       - data: ${this.data} \n
       - headers: ${JSON.stringify(this.reqOptions.headers)}`);
    */
    this.httpRequest.write(this.data);
    this.httpRequest.end();

    return this;
  }

  addHeaders() {
    if (this.reqOptions.method === 'GET') {
      this.reqOptions.headers[HttpUtil.Headers.ACCEPT] = HttpUtil.ContentTypes.JSON;
    }

    if (this.contentLength > 0) {
      this.reqOptions.headers[HttpUtil.Headers.CONTENT_TYPE] = HttpUtil.ContentTypes.JSON_WITH_CHARSET;
    }

    if (HttpUtil.needsContentLengthHeader(this.reqOptions.method)) {
      this.reqOptions.headers[HttpUtil.Headers.CONTENT_LENGTH] = this.contentLength;
    }

    return this;
  }

  addProxyIfNeeded() {
    if (this.httpOpts.proxy !== null) {
      const ProxyAgent = require('proxy-agent');
      let proxyUri = this.httpOpts.proxy;
      this.reqOptions.agent = new ProxyAgent(proxyUri);
    }

    return this;
  }

  addAuthorizationIfNeeded(req) {
    if (typeof this.httpOpts.credentials == 'object' && this.httpOpts.credentials.username) {
      let auth = new Auth(req);
      auth.addAuth(this.httpOpts.credentials.username, this.httpOpts.credentials.key);
    }

    return this;
  }
}

module.exports = HttpRequest;