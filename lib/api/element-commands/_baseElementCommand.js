const ElementCommand = require('../../element/command.js');

class BaseElementCommand extends ElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return null;
  }

  protocolAction() {
    if (!this.elementProtocolAction) {
      throw new Error('Define elementProtocolAction.');
    }

    return this.executeProtocolAction(this.elementProtocolAction, this.args);
  }

  performActionWithElement() {
    super.performActionWithElement()
      .catch(err => this.handleElementError(err))
      .then(result => this.complete(null, result));
  }

  handleElementError(err) {
    let shouldRegister;
    let callbackResult;
    let errorMessage;

    if (err instanceof Error) {
      callbackResult = {
        status: -1,
        value: {
          error: err.message,
          message: err.message,
          stack: err.stack
        }
      };
      errorMessage = err.message;
      shouldRegister = true;
    } else {
      callbackResult = err;
      shouldRegister = this.transport.shouldRegisterError(err);
      const error = (err.value && err.value.message || JSON.stringify(err));
      errorMessage = `An error occurred while running .${this.commandName}() command on <${this.element.toString()}>: ${error}`;
    }

    if (shouldRegister) {
      this.reporter.registerTestError(errorMessage);
    }

    return callbackResult;
  }
}

module.exports = BaseElementCommand;
