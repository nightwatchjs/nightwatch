const events = require('events');
const HttpUtil = require('./http.js');
const Formatter = require('./formatter.js');
const Logger = require('./../util/logger');

class HttpResponse extends events.EventEmitter {

  /**
   *
   * @param {http.ServerResponse} response
   * @param {object} request
   */
  constructor(response, request) {
    super();

    this.res = response;
    this.request = request;
    this.elapsedTime = null;
    this.res.setEncoding('utf8');

    this.redirected = HttpUtil.isRedirect(this.res.statusCode);

    this.handle();
  }

  handle() {
    this.flushResponse();

    let screenshotContent;

    this.res.on('end', () => {
      this.elapsedTime = new Date() - this.request.startTime;
      let result;
      let errorMessage = '';

      if (this.flushed.length > 0) {
        result = HttpResponse.parseResult(this.flushed);

        if (result.value) {
          if (result.value.screen) {
            screenshotContent = result.value.screen;
            delete result.value.screen;
          }

          if (result.value.stackTrace) {
            // Selenium stack traces won't help us here and they will pollute the output
            delete result.value.stackTrace;
          }

          if (Formatter.needsFormattedErrorMessage(result)) {
            errorMessage = Formatter.formatErrorMessage(result.value);
            delete result.value.localizedMessage;
            delete result.value.message;
          }
        }
      } else {
        result = {};
      }

      if (errorMessage !== '') {
        console.error(Logger.colors.yellow('There was an error while executing the Selenium command') +
          (!Logger.isEnabled() ? ' - enabling the --verbose option might offer more details.' : '')
        );
        console.error(errorMessage);
      }

      this.emit('beforeResult', result);

      this.logResponse(result);

      if (this.res.statusCode.toString().indexOf('2') === 0 || this.redirected) {
        if (this.request.isAborted) {
          return;
        }
        this.emit('success', result, this.res, this.redirected);
      } else {
        this.emit('error', result, this.res, screenshotContent);
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

  logResponse(result) {
    let base64Data;
    if (result.suppressBase64Data) {
      base64Data = result.value;
      result.value = '';
    }

    let logMethod = this.res.statusCode.toString().indexOf('5') === 0 ? 'error' : 'info';
    Logger[logMethod](`Response ${this.res.statusCode} ${this.request.reqOptions.method} ${this.request.hostname + this.request.reqOptions.path} (${this.elapsedTime}ms)`, result);

    if (result.suppressBase64Data) {
      result.value = base64Data;
    }
  }

  static parseResult(data) {
    let result;
    data = Formatter.stripUnknownChars(data);

    try {
      result = JSON.parse(data);
    } catch (err) {
      console.log(Logger.colors.red('Error processing the server response:'), '\n', data);
      result = {value: -1, error: err.message};
    }

    return result;
  }
}