const EventEmitter = require('events');
const http   = require('http');
const https  = require('https');
const HttpUtil = require('./http.js');
const HttpOptions = require('./options.js');
const Auth = require('./auth.js');
const Formatter = require('./formatter.js');
const HttpResponse = require('./response.js');
const Utils = require('./../utils');
const {Logger, isString} = Utils;

const __defaultSettings__ = {
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
    this.auth = null;

    this.setHttpOpts();
    this.setOptions(opts);
  }

  static set globalSettings(val) {
    __globalSettings__ = val;
  }

  static get globalSettings() {
    return __globalSettings__ || HttpOptions.global.settings;
  }

  static updateGlobalSettings(settings = {}) {
    Object.assign(__globalSettings__, settings);
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

    const {method} = options;
    if (options.data && !(method === 'POST' || method === 'PUT')) {
      options.data = '';
    }

    this.params = options.data;
    this.setData(options);
    this.contentLength = this.data.length;
    this.use_ssl = this.httpOpts.use_ssl || options.use_ssl;
    this.reqOptions = this.createHttpOptions(options);
    this.hostname = Formatter.formatHostname(this.reqOptions.host, this.reqOptions.port, this.use_ssl);
    this.retryAttempts = this.httpOpts.retry_attempts;
    this.redact = options.redact || false;

    return this;
  }

  setData(options) {
    if (!options.data) {
      this.data = '';

      return this;
    }

    this.data = Formatter.jsonStringify(options.data) || '';

    return this;
  }

  setPathPrefix(options) {
    const pathContainsPrefix = options.path && options.path.includes(this.httpOpts.default_path);
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

    if (options.url) {
      const url = new URL(options.url);
      reqOptions.path = url.pathname;
      reqOptions.host = url.hostname;
    }

    this.auth = options.auth || null;

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
      const req = (this.use_ssl ? https: http).request(this.reqOptions, response => {
        this.httpResponse = new HttpResponse(response, this);
        this.httpResponse.on('complete', this.onRequestComplete.bind(this));
        this.proxyEvents(this.httpResponse, ['response', 'error', 'success']);
      });

      this.addAuthorizationIfNeeded(req);

      return req;
    } catch (err) {
      err.message = `Error while trying to create HTTP request for "${this.reqOptions.path}": ${err.message}`;

      throw err;
    }
  }

  logRequest() {
    const retryStr = this.retryCount ? ` (retry ${this.retryCount})` : '';
    const params = this.params;
    // Trim long execute script strings from params
    if (this.reqOptions.path.includes('/execute/') && params.script) {
      params.script = params.script.substring(0, 200) + `... (${params.script.length} characters)`;
    }

    Logger.info(`  Request ${Logger.colors.light_cyan([this.reqOptions.method, this.hostname + this.reqOptions.path, retryStr + ' '].join(' '))}`, this.redact ? '<REDACTED>' : params);

    this.httpRequest.on('error', err => this.onRequestError(err));
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

  onRequestComplete(result, response) {
    this.logResponse(result);

    if (this.httpResponse.isRedirect) {
      let location;
      try {
        // eslint-disable-next-line
        location = require('url').parse(response.headers.location);
      } catch (ex) {
        Logger.error(ex);
        this.emit('error', new Error(`Failed to parse "Location" header for server redirect: ${ex.message}`));

        return;
      }

      this.reqOptions.host = location.hostname;
      this.reqOptions.port = location.port;
      this.reqOptions.path = location.pathname;
      this.reqOptions.method = 'GET';

      this.send();

      return;
    }

    this.emit('complete', result);
  }

  logResponse(result) {
    let base64Data;
    const shouldSupressData = isString(result.value) && this.addtOpts.suppressBase64Data && result.value.length > 100;
    if (shouldSupressData) {
      base64Data = result.value;
      result.value = `${base64Data.substr(0, 100)}...`;
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

    if (shouldSupressData) {
      result.value = base64Data;
    }
  }

  onRequestError(err) {
    this.logError(err);

    if (this.shouldRetryRequest(err)) {
      this.isAborted = true;
      this.socket.unref();
      this.retryCount = this.retryCount + 1;
      setTimeout(() => {
        this.send();
        this.retryAttempts = this.retryAttempts - 1;
      }, 100);

      return;
    }

    this.emit('error', err);

  }

  shouldRetryRequest(err) {
    return this.retryAttempts > 0 && isRetryableNetworkError(err);
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
      try {
        const ProxyAgent = require('proxy-agent');
        const proxyUri = this.httpOpts.proxy;
        this.reqOptions.agent = new ProxyAgent(proxyUri);
      } catch (err) {
        console.error('The proxy-agent module was not found. It can be installed from NPM with:\n\n' +
          '\tnpm install proxy-agent\n');
        process.exit(10);
      }
    }

    return this;
  }

  hasCredentials() {
    return Utils.isObject(this.httpOpts.credentials) && this.httpOpts.credentials.username;
  }

  addAuthorizationIfNeeded(req) {
    if (this.hasCredentials() || this.auth) {
      const auth = new Auth(req);

      if (this.hasCredentials()) {
        auth.addAuth(this.httpOpts.credentials.username, this.httpOpts.credentials.key);
      } else if (this.auth) {
        const {user, pass} = this.auth;

        if (user && pass) {
          auth.addAuth(user, pass);
        }
      }
    }

    return this;
  }
}

function isRetryableNetworkError(err) {
  if (err && err.code) {
    return (
      err.code === 'ECONNABORTED' ||
      err.code === 'ECONNRESET' ||
      err.code === 'ECONNREFUSED' ||
      err.code === 'EADDRINUSE' ||
      err.code === 'EPIPE' ||
      err.code === 'ETIMEDOUT'
    );
  }

  return false;
}

module.exports = HttpRequest;
