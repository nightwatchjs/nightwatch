const ClientCommand = require('./_base-command.js');

class Tap extends ClientCommand {
  get returnsFullResultObject() {
    return false;
  }

  performAction() {
    this.transportActions.tap(this.webElementOrId);
  }

  command(webElementOrId, callback) {
    this.webElementOrId = webElementOrId;

    return super.command(callback);
  }
}

module.exports = Tap;
