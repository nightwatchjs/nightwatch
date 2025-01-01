const ClientCommand = require('./_base-command.js');

class ScrollElement extends ClientCommand {
  get returnsFullResultObject() {
    return false;
  }

  performAction(callback) {
    this.transportActions.scrollElement(
      this.webElementOrId,
      this.direction,
      this.amount
    );
  }

  command(webElementOrId, direction, amount, callback) {
    this.webElementOrId = webElementOrId;
    this.direction = direction;
    this.amount = amount;

    return super.command(callback);
  }
}

module.exports = ScrollElement;
