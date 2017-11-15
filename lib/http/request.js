const events = require('events');
const http   = require('http');
const https  = require('https');
const Logger = require('./../util/logger');
const HttpUtil = require('./http.js');
const Auth = require('./auth.js');
const Formatter = require('./formatter.js');
const HttpResponse = require('./response.js');

let __defaultSettings__ = {
  host           : 'localhost',
  port           : 4444,
  default_path   : '',
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
    this.httpResponse = null;
    this.retryCount = 0;

    this.httpOpts = null;
    this.setOptions(opts);
  }

  static set globalSettings(val) {
    Object.keys(val).forEach(key => {
      if (!(key in __defaultSettings__)) {
        throw new Error(`Property "${key}" is not a valid setting.`)
      }
    });

    __globalSettings__ = Object.assign(__globalSettings__, val);
  }

  static get globalSettings() {
    return __globalSettings__;
  }

  set httpOpts(val) {
    this.__settings = Object.assign({}, __defaultSettings__, __globalSettings__, val);
  }

  get httpOpts() {
    return this.__settings;
  }

  get socket() {
    return this.httpRequest.socket;
  }

  get elapsedTime() {
    return this.httpResponse.elapsedTime;
  }

  get statusCode() {
    return this.httpResponse.res.statusCode;
  }

  setOptions(options) {
    this.setPathPrefix(options);

    this.data           = options.data && Formatter.jsonStringify(options.data) || '';
    this.contentLength  = this.data.length;
    this.reqOptions     = this.createOptions(options);
    this.hostname       = Formatter.formatHostname(this.reqOptions.host, this.reqOptions.port, this.httpOpts.use_ssl);
    this.retryAttempts  = this.httpOpts.retry_attempts;

    this.addHeaders()
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
      host    : options.host || this.httpOpts.host,
      port    : options.port || this.httpOpts.port,
      method  : options.method && options.method.toUpperCase() || HttpUtil.Method.GET,
      headers : {}
    };

    if (options.sessionId) {
      reqOptions.path = reqOptions.path.replace(':sessionId', options.sessionId);
    }

    return reqOptions;
  }

  proxyEvents(originalIssuer, events) {
    events.forEach(event => {
      originalIssuer.on(event, (...args) => {
        args.unshift(event);
        this.emit.apply(this, args);
      })
    });
  }

  createHttpRequest() {
    let req = (this.httpOpts.use_ssl ? https: http).request(this.reqOptions, response => {
      this.httpResponse = new HttpResponse(response, this);
      this.httpResponse.on('complete', this.logResponse.bind(this));
      this.httpResponse.res.on('end', _ => {
        if (this.shouldRetryRequest()) {
          this.retryCount++;
          this.send();
          this.retryAttempts = this.retryAttempts - 1;
        }
      });

      this.proxyEvents(this.httpResponse, ['complete', 'success', 'error']);
    });

    this.addAuthorizationIfNeeded(req);
    this.logRequest(req);

    return req;
  }

  logRequest(req) {
    let retryStr = this.retryCount ? ` (retry ${this.retryCount})` : '';
    Logger.info(`${Logger.colors.light_gray([this.reqOptions.method, this.hostname, this.reqOptions.path, retryStr + ' '].join(' '), Logger.colors.background.black)}
   - data: ${this.data}
   - headers: ${JSON.stringify(this.reqOptions.headers)}`);

    req.on('error', err => {
      let message = err.stack ? err.stack : (err.message || err);
      Logger.error(`${[this.reqOptions.method, this.hostname, this.reqOptions.path].join(' ') + (err.code ? ' - ' + err.code : '')}
  ${message}`);
    });
  }

  logResponse(result) {
    let base64Data;
    if (result.suppressBase64Data) {
      base64Data = result.value;
      result.value = '';
    }

    let logMethod = this.statusCode.toString().indexOf('5') === 0 ? 'error' : 'info';
    Logger[logMethod](`Response ${this.statusCode} ${this.reqOptions.method} ${this.hostname + this.reqOptions.path} (${this.elapsedTime}ms)`, result);

    if (result.suppressBase64Data) {
      result.value = base64Data;
    }
  }

  shouldRetryRequest() {
    return this.retryAttempts > 0;
  }

  post() {
    this.reqOptions.method = HttpUtil.Method.POST;

    return this.send();
  }

  delete() {
    this.reqOptions.method = HttpUtil.Method.DELETE;

    return this.send();
  }

  put() {
    this.reqOptions.method = HttpUtil.Method.PUT;

    return this.send();
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

    this.proxyEvents(this.httpRequest, ['error']);

    this.httpRequest.setTimeout(this.httpOpts.timeout, () => {
      if (this.shouldRetryRequest()) {
        this.socket.unref();
        this.isAborted = true;
      } else {
        this.httpRequest.abort();
      }
    });

    this.httpRequest.write(this.data);
    this.httpRequest.end();

    return this;
  }

  addHeaders() {
    if (this.reqOptions.method === HttpUtil.Method.GET) {
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

  hasCredentials() {
    return this.httpOpts.credentials && typeof this.httpOpts.credentials == 'object' && this.httpOpts.credentials.username
  }

  addAuthorizationIfNeeded(req) {
    if (this.hasCredentials()) {
      let auth = new Auth(req);
      auth.addAuth(this.httpOpts.credentials.username, this.httpOpts.credentials.key);
    }

    return this;
  }
}

module.exports = HttpRequest;