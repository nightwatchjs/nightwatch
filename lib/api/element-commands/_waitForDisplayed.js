const WaitForElement = require('./_waitFor.js');

class WaitForDisplayed extends WaitForElement {
  protocolAction() {
    return this.executeProtocolAction('isElementDisplayed');
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
        retryOnSuccess: this.retryOnValidActionResult,
        validate,
        isResultStale,
        successHandler,
        errorHandler: (err) => {
          if (err.name !== 'TimeoutError') {
            return err;
          }

          if (this.retryOnValidActionResult) {
            return this.protocolActionHandler(err.response);
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
