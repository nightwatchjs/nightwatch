const {WebElement} = require('selenium-webdriver');
const ElementCommand = require('../../element').Command;
const Utils = require('../../utils');
const {Logger, filterStackTrace} = Utils;

class BaseElementCommand extends ElementCommand {
  get w3c_deprecated() {
    return false;
  }

  static getErrorMessage(response = {}) {
    const {value, error = ''} = response;

    if (value && value.error) {
      return value.error;
    }

    return error;
  }

  get extraArgsCount() {
    return 0;
  }

  get retryOnFailure() {
    return true;
  }

  get elementProtocolAction() {
    return null;
  }

  static get isTraceable() {
    return false;
  }

  setOptionsFromSelector() {
    this.abortOnFailure = this.api.globals.abortOnElementLocateError;

    super.setOptionsFromSelector();
  }

  async findElementAction({cacheElementId = true} = {}) {
    if (WebElement.isId(this.selector)) {
      return {
        value: this.selector,
        status: 0,
        result: {}
      };
    }

    if ((this.selector instanceof Promise) && this.selector['@nightwatch_element']) {
      this.__element = await this.selector;
    }

    return this.findElement({cacheElementId});
  }

  setupActions() {
    const isResultStale = (response) => {
      const result = this.transport.isRetryableElementError(response);

      return result;
    };
    const validate = (result) => this.isResultSuccess(result);
    const successHandler = (result) => this.complete(null, result);

    this.elementCommandRetries = 0;
    this.maxElementCommandRetries = this.settings.element_command_retries;

    this.executor
      .queueAction({
        action: (opts) => this.findElementAction(opts),
        retryOnSuccess: this.retryOnSuccess,
        shouldRetryOnError: (response) => {
          return !this.transport.invalidWindowReference(response.result || response);
        },
        validate,
        errorHandler: err => {
          const result = err.response || {};

          if (this.suppressNotFoundErrors) {
            return this.complete(null, result);
          }

          let error;
          if (result.error && result.error.name === 'NoSuchElementError') {
            error = result.error;
          } else {
            error = this.noSuchElementError(err);
            error.response = result;
          }

          return this.elementLocateError(error);
        }
      })
      .queueAction({
        action: (response) => this.elementFound(response),
        retryOnSuccess: this.retryOnValidActionResult,
        retryOnFailure: this.retryOnFailure,
        validate: (result) => this.transport.isResultSuccess(result),
        isResultStale,
        successHandler,
        errorHandler: (err) => this.handleElementError(err)
      });
  }

  elementNotFound(err) {
    return this.handleElementError(err);
  }

  shouldRetryElementCommand(result) {
    if (this.transport.isRetryableElementError(result) && this.elementCommandRetries < this.maxElementCommandRetries) {
      return true;
    }

    return false;
  }

  async protocolAction() {
    if (!this.elementProtocolAction) {
      throw new Error('Define elementProtocolAction.');
    }

    const result = await this.executeProtocolAction(this.elementProtocolAction, this.args);

    this.elementCommandRetries++;

    // if (this.shouldRetryElementCommand(result)) {
    //   this.__retryOnFailure = true;
    //   this.elementCommandRetries++;
    // } else {
    //   //this.__retryOnFailure = false;
    // }

    if (result && result.error instanceof Error) {
      this.transport.registerLastError(result.error, this.elementCommandRetries);
    }

    return result;
  }

  handleElementError(err) {
    const showRegisterError = this.transport.shouldRegisterError(err);

    let originalErrorMessage;
    if (err instanceof Error) {
      originalErrorMessage = err.message;
    } else {
      originalErrorMessage = BaseElementCommand.getErrorMessage(err.response);
    }

    err.message = `An error occurred while running .${this.commandName}() command on <${this.element.toString()}>: ${originalErrorMessage}`;
    if (err.response) {
      err.detailedErr = JSON.stringify(err.response);
    }

    err.stack = filterStackTrace(this.stackTrace);

    if (showRegisterError) {
      Logger.error(err);

      this.reporter.registerTestError(err);
      err.registered = true;
    }

    const {message, stack} = err;
    const callbackResult = {
      status: -1,
      value: {
        error: message,
        message,
        stack
      }
    };

    if (this.abortOnFailure) {
      return this.complete(err, err.response || {});
    }

    return this.complete(null, callbackResult);
  }
}

module.exports = BaseElementCommand;
