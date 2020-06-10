const WaitForElement = require('./_waitFor.js');
const {BrowserName} = require('../../utils');

class WaitForDisplayed extends WaitForElement {
  protocolAction() {
    if (this.api.capabilities) {
      // FIXME: temporary fix to get safari working
      const {browserName, version} = this.api.capabilities;
      let {browserVersion} = this.api.capabilities;

      if (version) {
        browserVersion = version;
      }
      browserVersion = parseInt(browserVersion, 10);

      // Are we running 12 or newer?
      if (browserName.toLowerCase() === BrowserName.SAFARI && (browserVersion >= 12) && this.settings.webdriver.start_process === true) {
        return this.executeProtocolAction('getElementProperty', ['hidden']).then(result => ({
          value: result.value === false
        }));
      }
    }

    return this.executeProtocolAction('isElementDisplayed');
  }

  shouldRetryAction(elementVisible) {
    throw new Error('Override');
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
