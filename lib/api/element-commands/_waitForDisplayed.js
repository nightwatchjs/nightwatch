const WaitForElement = require('./_waitFor.js');

class WaitForDisplayed extends WaitForElement {
  protocolAction() {
    return this.executeProtocolAction('isElementDisplayed');
  }

  shouldRetryAction(elementVisible) {
    throw new Error('Override');
  }

  elementNotFound(err) {
    if (!(err instanceof WaitForDisplayed.NoSuchElementError)) {
      err = this.noSuchElementError();
      err.detailedLogging = false;
    }

    return this.complete(err, {});
  }

  setupActions() {
    const isResultStale = (result) => this.transport.staleElementReference(result);
    const validate = (result) => this.isResultSuccess(result);
    const successHandler = (result) => this.protocolActionHandler(result);

    this.executor
      .queueAction({
        action: () => this.findElement(),
        retryOnSuccess: this.retryOnSuccess,
        validate,
        errorHandler: (err) => {
          if (err.name !== 'TimeoutError') {
            return err;
          }

          return this.elementNotFound(err.response);
        }
      })
      .queueAction({
        action: (response) => this.elementFound(response),
        retryOnSuccess: (result) => {
          const elementVisible = WaitForElement.isElementVisible(result);

          return this.shouldRetryAction(elementVisible);
        },
        validate,
        isResultStale,
        successHandler,
        errorHandler: (err) => {
          if (err.name !== 'TimeoutError') {
            return err;
          }

          return this.complete(err, {});
        }
      });
  }

  protocolActionHandler(result) {
    const now = new Date().getTime();

    if (WaitForElement.isElementVisible(result)) {
      return this.elementVisible({result, now});
    }

    return this.elementNotVisible({result, now});
  }

  elementVisible(response) {}
  elementNotVisible(response) {}
}

module.exports = WaitForDisplayed;
