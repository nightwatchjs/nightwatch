const EventEmitter = require('events');
const HttpUtil = require('./http.js');
const Formatter = require('./formatter.js');
const Logger = require('./../util/logger');

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

    this.redirected = HttpUtil.isRedirect(this.res.statusCode);

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
        this.responseData = {};
      }

      this.emit('response', this.responseData);

      if (this.responseData.screenshotContent) {
        screenshotContent = this.responseData.screenshotContent;
        delete this.responseData.screenshotContent;
      }

      this.emit('complete', this.responseData);

      if (this.res.statusCode.toString().indexOf('2') === 0 || this.redirected) {
        if (this.request.isAborted) {
          return;
        }

        this.emit('success', this.responseData, this.res, this.redirected);
      } else {
        this.emit('error', this.responseData, this.res, screenshotContent);
      }
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

  isResponseJson(data) {
    return this.res.headers['content-type'] && this.res.headers['content-type'].indexOf('application/json') > -1;
  }

  parseResponseData(data) {
    let result;
    data = Formatter.stripUnknownChars(data);

    if (data && !this.isResponseJson(data)) {
      return {
        status: -1,
        value: data
      };
    }

    try {
      result = JSON.parse(data);
    } catch (err) {
      console.error(Logger.colors.red('Error processing the server response:'), '\n', data);
      result = {status: -1, value: err.message};
    }

    return result;
  }
}

module.exports = HttpResponse;