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
      let responseData;
      let errorMessage = '';
      this.elapsedTime = new Date() - this.request.startTime;

      if (this.flushed.length > 0) {
        responseData = HttpResponse.parseResponseData(this.flushed);

        if (typeof responseData.status != 'undefined') {
          responseData.status = parseInt(responseData.status, 10);
        }

        if (responseData.value) {
          if (responseData.value.screen) {
            screenshotContent = responseData.value.screen;
            delete responseData.value.screen;
          }

          if (responseData.value.stackTrace) {
            // Selenium stack traces won't help us here and they will pollute the output
            delete responseData.value.stackTrace;
          }

          if (Formatter.needsFormattedErrorMessage(responseData)) {
            errorMessage = Formatter.formatErrorMessage(responseData.value);
            delete responseData.value.localizedMessage;
            delete responseData.value.message;
          }
        }
      } else {
        responseData = {};
      }

      if (errorMessage !== '') {
        Logger.error('There was an error while executing the Selenium command' +
          (Logger.isEnabled() ? '': ' - enabling the --verbose option might offer more details.') +
        `\n${errorMessage}`);
      }

      this.emit('complete', responseData);

      if (this.res.statusCode.toString().indexOf('2') === 0 || this.redirected) {
        if (this.request.isAborted) {
          return;
        }

        this.emit('success', responseData, this.res, this.redirected);
      } else {
        this.emit('error', responseData, this.res, screenshotContent);
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

  static parseResponseData(data) {
    let result;
    data = Formatter.stripUnknownChars(data);

    try {
      result = JSON.parse(data);
    } catch (err) {
      console.error(Logger.colors.red('Error processing the server response:'), '\n', data);
      result = {value: -1, error: err.message};
    }

    return result;
  }
}

module.exports = HttpResponse;