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
      if (Utils.isObject(value) && value.elementId) {
        this.elementId = value.elementId;
      } else {
        this.elementId = this.transport.getElementId(value);
      }
    }

    super.onPromiseResolved();
  }

  formatMessage() {
    let {selector, name} = this.element;
    let nameStr = '';

    if (name) {
      nameStr = `@${name} `;
    }

    selector = selector ? `${nameStr}<${selector}>` : `<${this.element.toString()}>`;


    this.message = Utils.format(this.message, selector, this.elapsedTime);

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

    const {sessionId, element} = this.emitter;
    if (element && element.webElement) {
      this.elementId = element.resolvedElement || element.webElement;
    }
    args.unshift(this.elementId);

    if (sessionId) {
      return this.transportActions[protocolAction](args, sessionId);
    }

    return this.transportActions[protocolAction](...args);
  }

  retryCommand() {
    if (this.shouldRetryLocateElement()) {
      this.resultErrorStatus = null;
      this.elementId = null;
      this.resultValue = null;
      this.promise = this.emitter.createRetryPromise();
      this.promise.then(this.onPromiseResolved.bind(this), this.onPromiseRejected.bind(this));
      this.emitter.retryCommand();
    } else {
      this.onPromiseResolved();
    }
  }

  shouldRetryLocateElement() {
    return !this.elementId || this.isRetryableElementError();
  }

  isRetryableElementError() {
    return this.transport.isRetryableElementError(this.resultErrorStatus || this.resultStatus);
  }

  isComponent() {
    return this.flag('component') === true;
  }
}

module.exports = ExpectElement;
