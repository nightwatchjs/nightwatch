const ElementCommand = require('../../element').Command;

class BaseElementCommand extends ElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get retryOnFailure() {
    return this.__retryOnFailure || false;
  }

  get elementProtocolAction() {
    return null;
  }

  setOptionsFromSelector() {
    this.abortOnFailure = false;

    super.setOptionsFromSelector();
  }

  setupActions() {
    const isResultStale = (result) => this.transport.staleElementReference(result);
    const validate = (result) => this.isResultSuccess(result);
    const successHandler = (result) => this.complete(null, result);

    this.executor
      .queueAction({
        action: () => this.findElement(),
        retryOnSuccess: this.retryOnSuccess,
        shouldRetryOnError: (response) => {
          return !this.transport.invalidWindowReference(response.result);
        },
        validate,
        errorHandler: err => {
          const result = err.response && err.response.result || {};

          if (this.suppressNotFoundErrors) {
            return this.complete(null, result);
          }

          const error = this.noSuchElementError(err);
          error.response = result;

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

  protocolAction() {
    if (!this.elementProtocolAction) {
      throw new Error('Define elementProtocolAction.');
    }

    return this.executeProtocolAction(this.elementProtocolAction, this.args);
  }

  handleElementError(err) {
    const shouldRegister = this.transport.shouldRegisterError(err);
    const errorMessage = err.response && err.response.value && err.response.value.error ? (err.response.value.error + '; ' + err.response.value.message) : '';

    err.message = `An error occurred while running .${this.commandName}() command on <${this.element.toString()}>: ${errorMessage}`;
    err.detailedErr = JSON.stringify(err.response);

    const callbackResult = {
      status: -1,
      value: {
        error: err.message,
        message: err.message,
        stack: err.stack
      }
    };

    if (shouldRegister) {
      this.reporter.registerTestError(err);
    }

    if (this.abortOnFailure) {
      return this.complete(err, err.response);
    }

    return this.complete(null, callbackResult);
  }
}

module.exports = BaseElementCommand;
