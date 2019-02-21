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

  execute() {
    return super.execute()
      .catch(err => this.handleElementError(err))
      .then(result => this.complete(null, result));
  }
}

module.exports = BaseElementCommand;
