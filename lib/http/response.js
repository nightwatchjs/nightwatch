const EventEmitter = require('events');
const HttpUtil = require('./http.js');
const Formatter = require('./formatter.js');
const Utils = require('../utils');

class HttpResponse extends EventEmitter {

  /**
   *
   * @param {http.ServerResponse} response
   * @param {object} request
   */
  constructor(response, request) {
    super();

    this.elapsedTime = null;
    this.res = response;
    this.request = request;
    this.res.setEncoding('utf8');
    this.isRedirect = HttpUtil.isRedirect(response.statusCode);
    this.isInternalServerError = response.statusCode >= 500;
    this.handle();
  }

  handle() {
    this.flushResponse();

    let screenshotContent;

    this.res.on('end', () => {
      this.elapsedTime = new Date() - this.request.startTime;

      if (this.flushed.length > 0) {
        this.responseData = this.parseResponseData(this.flushed);

        if (typeof this.responseData.status != 'undefined') {
          this.responseData.status = parseInt(this.responseData.status, 10);
        }
      } else {
        // for error we have to send empty response, otherwise selenium-webdriver treats the request as success.
        this.responseData = (this.res.statusCode >= 400) ? '' : {};
      }

      this.emit('response', this.responseData);

      if (this.responseData.screenshotContent) {
        screenshotContent = this.responseData.screenshotContent;
        delete this.responseData.screenshotContent;
      }

      this.emit('complete', this.responseData, this.res);

      if (this.request.isAborted || this.isRedirect) {
        return;
      }

      if (this.isInternalServerError && this.request.retryAttempts > 0) {
        return;
      }

      this.emit('success', this.responseData, this.res);
    });
  }

  flushResponse() {
    this.flushed = '';
    this.res.on('data', chunk => {
      if (this.request.reqOptions.method !== 'HEAD') {
        this.flushed += chunk;
      }
    });
  }

  isResponseJson() {
    return this.res.headers['content-type'] && this.res.headers['content-type'].indexOf('application/json') > -1;
  }

  isServerError() {
    return this.res.statusCode.toString().startsWith('5');
  }

  parseResponseData(data) {
    let result;
    data = data.toString();
    data = Formatter.stripUnknownChars(data);

    try {
      result = JSON.parse(data);
    } catch (err) {
      result = data;
    }

    // sometimes the server non-json error responses end up parsed as strings and the error in undetected
    if (Utils.isString(result) && this.isServerError()) {
      return {
        status: -1,
        error: 'internal server error',
        value: result
      };
    }

    if (result.value && result.value.stacktrace) {
      // this is in order to not pollute verbose logs
      result.value.stacktrace = '';
    }

    return result;
  }
}

module.exports = HttpResponse;
