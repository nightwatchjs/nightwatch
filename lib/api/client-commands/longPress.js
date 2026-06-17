const ClientCommand = require('./_base-command.js');

class LongPress extends ClientCommand {
  get returnsFullResultObject() {
    return false;
  }

  performAction() {
    this.transportActions.longPress(this.webElementOrId, this.duration);
  }

  command(webElementOrId, duration, callback) {
    this.webElementOrId = webElementOrId;
    this.duration = duration;

    return super.command(callback);
  }
}

module.exports = LongPress;
