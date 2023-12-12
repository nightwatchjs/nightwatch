const WaitForElement = require('./_waitFor.js');

class WaitForDisplayed extends WaitForElement {
  protocolAction() {
    return this.executeProtocolAction('isElementDisplayed');
  }

  shouldRetryAction(elementVisible) {
    throw new Error('Override');
  }

  setupActions() {
    const isResultStale = (result) => {
      const errorResponse = this.transport.getErrorResponse(result);

      return this.transport.staleElementReference(errorResponse);
    };
    const validate = (result) => this.isResultSuccess(result);
    const successHandler = (result) => this.protocolActionHandler(result);

    this.executor
      .queueAction({
        action: () => this.findElement({cacheElementId: false}),
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
    if (WaitForElement.isElementVisible(result)) {
      return this.elementVisible(result);
    }

    return this.elementNotVisible(result);
  }

  elementVisible(response) {}
  elementNotVisible(response) {}
}

module.exports = WaitForDisplayed;
