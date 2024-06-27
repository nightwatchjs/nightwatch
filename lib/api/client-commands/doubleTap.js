const ClientCommand = require('./_base-command.js');

class DoubelTap extends ClientCommand {
  get returnsFullResultObject() {
    return false;
  }

  performAction() {
    this.transportActions.doubleTap(this.webElementOrId);
  }

  command(webElementOrId, callback) {
    this.webElementOrId = webElementOrId;

    return super.command(callback);
  }
}

module.exports = DoubelTap;
