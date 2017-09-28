const events = require('events');
const http   = require('http');
const https  = require('https');
const HttpUtil = require('./http.js');
const Auth = require('./auth.js');
const Formatter = require('./formatter.js');
const HttpResponse = require('./response.js');
const Logger = require('./../util/logger');

let __settings__ = {
  selenium_host  : 'localhost',
  selenium_port  : 4444,
  default_path   : '/wd/hub',
  credentials    : null,
  use_ssl        : false,
  proxy          : null,
  timeout        : 60000,
  retry_attempts : 0
};

class HttpRequest extends events.EventEmitter {
  static get Settings() {
    return __settings__;
  }

  constructor(opts) {
    super();

    this.httpRequest = null;
    this.response    = null;

    this.setOptions(opts);
  }

  setOptions(options) {
    this.data           = options.data && Formatter.jsonStringify(options.data) || '';
    this.contentLength  = this.data.length;
    this.reqOptions     = this.createOptions(options);
    this.hostname       = Formatter.formatHostname(this.reqOptions.host, this.reqOptions.port, HttpRequest.Settings.use_ssl);
    this.timeout        = HttpRequest.Settings.timeout;
    this.retryAttempts  = HttpRequest.Settings.retry_attempts;

    this
      .setPathPrefix(options)
      .addHeaders()
      .addProxyIfNeeded();

    return this;
  }

  setPathPrefix(options) {
    this.defaultPathPrefix = options.path && options.path.indexOf(HttpRequest.Settings.default_path) === -1 ?
      HttpRequest.Settings.default_path : '';
    return this;
  }

  createOptions(options) {
    let reqOptions = {
      path    : this.defaultPathPrefix + (options.path || ''),
      host    : options.host || HttpRequest.Settings.selenium_host,
      port    : options.selenium_port || HttpRequest.Settings.selenium_port,
      method  : options.method &&  options.method.toUpperCase() || 'POST',
      headers : {}
    };

    if (options.sessionId) {
      reqOptions.path = reqOptions.path.replace(':sessionId', options.sessionId);
    }

    return reqOptions;
  }

  send() {
    this.startTime = new Date();
    this.isAborted = false;

    this.httpRequest = (HttpRequest.Settings.use_ssl ? https: http).request(this.reqOptions, response => {
      this.response = new HttpResponse(response, this);
      this.response.on('beforeResult', result => {
        this.emit('beforeResult', result);
      })
    });

    HttpRequest.addAuthorizationIfNeeded(this.httpRequest);

    this.httpRequest.on('error', response => {
      this.emit('error', {}, response);
    });

    this.httpRequest.setTimeout(this.timeout, function() {
      if (this.retryAttempts) {
        this.httpRequest.socket.unref();
        this.isAborted = true; // prevent emitting of the success event multiple times.
        this.retryAttempts = this.retryAttempts - 1;
        this.send();
      } else {
        this.httpRequest.abort();
      }
    });

    Logger.info(`Request: ${this.reqOptions.method} ${this.hostname} ${this.reqOptions.path} \n
       - data: ${this.data} \n
       - headers: ${JSON.stringify(this.reqOptions.headers)}`);

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
    if (HttpRequest.Settings.proxy !== undefined) {
      const ProxyAgent = require('proxy-agent');
      let proxyUri = HttpRequest.Settings.proxy;
      this.reqOptions.agent = new ProxyAgent(proxyUri);
    }

    return this;
  }

  static addAuthorizationIfNeeded(httpRequest) {
    if (typeof HttpRequest.Settings.credentials == 'object' && HttpRequest.Settings.credentials.username) {
      let auth = new Auth(httpRequest);
      auth.addAuth(HttpRequest.Settings.credentials.username, HttpRequest.Settings.credentials.key);
    }

    return this;
  }

  static setSeleniumPort(port) {
    HttpRequest.Settings.selenium_port = port;
  }

  static useSSL(value) {
    HttpRequest.Settings.use_ssl = value;
  }

  static setSeleniumHost(host) {
    HttpRequest.Settings.selenium_host = host;
  }

  static setCredentials(credentials) {
    HttpRequest.Settings.credentials = credentials;
  }

  static setProxy(proxy) {
    HttpRequest.Settings.proxy = proxy;
  }

  static setDefaultPathPrefix(path) {
    HttpRequest.Settings.default_path = path;
  }

  static setTimeout(timeout) {
    HttpRequest.Settings.timeout = timeout;
  }

  static setRetryAttempts(retryAttempts) {
    HttpRequest.Settings.retry_attempts = retryAttempts;
  }
}
