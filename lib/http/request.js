const EventEmitter = require('events');
const http   = require('http');
const https  = require('https');
const HttpUtil = require('./http.js');
const HttpOptions = require('./options.js');
const Auth = require('./auth.js');
const Formatter = require('./formatter.js');
const HttpResponse = require('./response.js');
const Utils = require('./../utils');
const {Logger} = Utils;

let __defaultSettings__ = {
  credentials: null,
  use_ssl: false,
  proxy: null,
  timeout: 60000,
  retry_attempts: 0
};

let __globalSettings__ = null;

class HttpRequest extends EventEmitter {
  static get USER_AGENT() {
    const version = require('../../package.json').version;
    const platform = ({darwin: 'mac', win32: 'windows'}[process.platform]) || 'linux';

    return `nightwatch.js/${version} (${platform})`;
  }

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

  setHttpOpts() {
    this.__settings = Object.assign({}, __defaultSettings__, HttpRequest.globalSettings);
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
    this.redact = options.redact || false;

    return this;
  }

  setPathPrefix(options) {
    let pathContainsPrefix = options.path && options.path.includes(this.httpOpts.default_path);
    this.defaultPathPrefix = pathContainsPrefix ? '' : this.httpOpts.default_path;

    return this;
  }

  createHttpOptions(options) {
    const reqOptions = {
      path: this.defaultPathPrefix + (options.path || ''),
      host: options.host || this.httpOpts.host,
      port: options.port || this.httpOpts.port,
      method: options.method && options.method.toUpperCase() || HttpUtil.Method.GET,
      headers: {
        'User-Agent': HttpRequest.USER_AGENT
      }
    };

    if (this.httpOpts.keep_alive) {
      let keepAliveMsecs = 3000;
      let enabled = true;
      if (Utils.isObject(this.httpOpts.keep_alive)) {
        keepAliveMsecs = Number(this.httpOpts.keep_alive.keepAliveMsecs);
        enabled = JSON.parse(this.httpOpts.keep_alive.enabled);
      }

      if (enabled) {
        reqOptions.agent = new (reqOptions.port === 443 ? https: http)['Agent']({
          keepAlive: enabled,
          maxSockets: 1,
          keepAliveMsecs
        });
      }
    }

    if (options.sessionId) {
      reqOptions.path = reqOptions.path.replace(':sessionId', options.sessionId);
    }

    return reqOptions;
  }

  proxyEvents(originalIssuer, events) {
    events.forEach(event => {
      originalIssuer.on(event, (...args) => {
        args.unshift(event);

        if (event === 'error' && this.shouldRetryRequest()) {
          this.isAborted = true;
          this.socket.unref();
          this.retryCount = this.retryCount + 1;
          this.send();
          this.retryAttempts = this.retryAttempts - 1;

          return;
        }

        this.emit.apply(this, args);
      });
    });
  }

  createHttpRequest() {
    try {
      const req = (this.httpOpts.use_ssl ? https: http).request(this.reqOptions, response => {
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

    Logger.info(`  Request ${Logger.colors.light_cyan([this.reqOptions.method, this.hostname, this.reqOptions.path, retryStr + ' '].join(' '))}`, this.redact ? '<REDACTED>' : this.params);

    this.httpRequest.on('error', err => this.logError(err));
  }

  logError(err) {
    let message;
    if (Utils.isErrorObject(err)) {
      message = Utils.stackTraceFilter(err.stack.split('\n'));
    } else {
      message = err.message || err;
    }

    Logger.error(`   ${[this.reqOptions.method, this.hostname, this.reqOptions.path].join(' ') + (err.code ? ' - ' + err.code : '')}\n${message}`);
  }

  logResponse(result) {
    let base64Data;
    if (this.addtOpts.suppressBase64Data) {
      base64Data = result.value;
      result.value = '';
      result.suppressBase64Data = true;
    }

    let logMethod = this.statusCode.toString().startsWith('5') ? 'error' : 'info';
    // selenium server throws 500 errors for elements not found
    if (this.reqOptions.path.endsWith('/element') && logMethod === 'error') {
      const {value = ''} = result;
      const errorMessage = Utils.isObject(value) ? value.message : value;
      if (errorMessage.startsWith('no such element')) {
        logMethod = 'info';
      }
    }

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

    const {hostname, data} = this;
    const {method, path, headers} = this.reqOptions;

    this.emit('send', {
      hostname,
      data,
      method,
      path,
      headers
    });

    this.httpRequest = this.createHttpRequest();
    this.logRequest();
    this.proxyEvents(this.httpRequest, ['error']);

    this.httpRequest.setTimeout(this.httpOpts.timeout, () => {
      this.httpRequest.abort();
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
      // TODO: remove proxy-agent as dependency
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
