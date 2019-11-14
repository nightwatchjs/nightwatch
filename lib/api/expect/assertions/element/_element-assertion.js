const Utils = require('../../../../utils');
const BaseAssertion = require('../_baseAssertion.js');

class ExpectElement extends BaseAssertion {
  /**
   * @override
   */
  onResultSuccess() {}

  /**
   * @override
   */
  onResultFailed() {}


  onPromiseResolved(value) {
    if (value) {
      this.elementId = value;
    }

    super.onPromiseResolved();
  }

  formatMessage() {
    this.message = Utils.format(this.message, this.element.selector);

    super.formatMessage();
  }

  /**
   *
   * @param {String} protocolAction
   * @param {Array} [args]
   * @return {Promise}
   */
  executeProtocolAction(protocolAction, args = []) {
    if (!Array.isArray(args)) {
      args = [args];
    }

    return this.transportActions[protocolAction](this.elementId, ...args);
  }

  retryCommand() {
    if (this.shouldRetryLocateElement()) {
      this.promise = this.emitter.createRetryPromise();
      this.promise.then(this.onPromiseResolved.bind(this), this.onPromiseRejected.bind(this));
      this.emitter.retryCommand();
    } else {
      this.onPromiseResolved();
    }
  }

  shouldRetryLocateElement() {
    return (!this.elementId || this.stateElementReference(this.resultStatus) || this.stateElementReference(this.resultErrorStatus));
  }

  stateElementReference(errorStatus) {
    return this.transport.staleElementReference({
      errorStatus
    });
  }
}

module.exports = ExpectElement;
