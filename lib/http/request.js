const EventEmitter = require('events');
const http   = require('http');
const https  = require('https');
const Logger = require('./../util/logger.js');
const Utils = require('./../util/utils.js');
const HttpUtil = require('./http.js');
const HttpOptions = require('./options.js');
const Auth = require('./auth.js');
const Formatter = require('./formatter.js');
const HttpResponse = require('./response.js');

let __defaultSettings__ = {
  credentials    : null,
  use_ssl        : false,
  proxy          : null,
  timeout        : 60000,
  retry_attempts : 0
};

let __globalSettings__ = null;

class HttpRequest extends EventEmitter {
  constructor(opts) {
    super();

    this.__settings = null;
    this.isAborted = false;
    this.httpRequest = null;
    this.httpResponse = null;
    this.retryCount = 0;
    this.addtOpts = opts.addtOpts || {};

    this.setHttpOpts();
    this.setOptions(opts);
  }

  static set globalSettings(val) {
    __globalSettings__ = val;
  }

  static get globalSettings() {
    return __globalSettings__ || HttpOptions.global.settings;
  }

  setHttpOpts(val) {
    this.__settings = Object.assign({}, __defaultSettings__, HttpRequest.globalSettings, val);
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

    this.params = options.data;
    this.data = options.data && Formatter.jsonStringify(options.data) || '';
    this.contentLength = this.data.length;
    this.reqOptions = this.createHttpOptions(options);
    this.hostname = Formatter.formatHostname(this.reqOptions.host, this.reqOptions.port, this.httpOpts.use_ssl);
    this.retryAttempts = this.httpOpts.retry_attempts;

    return this;
  }

  setPathPrefix(options) {
    let pathContainsPrefix = options.path && options.path.includes(this.httpOpts.default_path);
    this.defaultPathPrefix = pathContainsPrefix ? '' : this.httpOpts.default_path;

    return this;
  }

  createHttpOptions(options) {
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
      });
    });
  }

  createHttpRequest() {
    try {
      let req = (this.httpOpts.use_ssl ? https: http).request(this.reqOptions, response => {
        this.httpResponse = new HttpResponse(response, this);
        this.httpResponse.on('complete', this.logResponse.bind(this));
        this.proxyEvents(this.httpResponse, ['response', 'complete', 'success', 'error']);
      });

      this.addAuthorizationIfNeeded(req);

      return req;
    } catch (err) {
      err.message = `Error while trying to create HTTP request for "${this.reqOptions.path}": ${err.message}`;

      throw err;
    }
  }

  logRequest() {
    let retryStr = this.retryCount ? ` (retry ${this.retryCount})` : '';

    Logger.info(`  Request ${Logger.colors.light_cyan([this.reqOptions.method, this.hostname, this.reqOptions.path, retryStr + ' '].join(' '))}`, this.params);

    this.httpRequest.on('error', err => {
      let message;
      if (Utils.isErrorObject(err)) {
        message = Utils.stackTraceFilter(err.stack.split('\n'));
      } else {
        message = err.message || err;
      }

      Logger.error(`   ${[this.reqOptions.method, this.hostname, this.reqOptions.path].join(' ') + (err.code ? ' - ' + err.code : '')}\n${message}`);
    });
  }

  logResponse(result) {
    let base64Data;
    if (this.addtOpts.suppressBase64Data) {
      base64Data = result.value;
      result.value = '';
      result.suppressBase64Data = true;
    }

    let logMethod = this.statusCode.toString().indexOf('5') === 0 ? 'error' : 'info';
    Logger[logMethod](`  Response ${this.statusCode} ${this.reqOptions.method} ${this.hostname + this.reqOptions.path} (${this.elapsedTime}ms)`, result);

    if (this.addtOpts.suppressBase64Data) {
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

  send() {
    this.addHeaders().setProxyIfNeeded();

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
    this.logRequest();

    this.proxyEvents(this.httpRequest, ['error']);

    this.httpRequest.setTimeout(this.httpOpts.timeout, () => {
      this.httpRequest.abort();

      if (this.shouldRetryRequest()) {
        this.socket.unref();
        this.isAborted = true;
        this.retryCount = this.retryCount + 1;

        this.send();
        this.retryAttempts = this.retryAttempts - 1;
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

  setProxyIfNeeded() {
    if (this.httpOpts.proxy !== null) {
      const ProxyAgent = require('proxy-agent');
      let proxyUri = this.httpOpts.proxy;
      this.reqOptions.agent = new ProxyAgent(proxyUri);
    }

    return this;
  }

  hasCredentials() {
    return Utils.isObject(this.httpOpts.credentials) && this.httpOpts.credentials.username;
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
