const ClientCommand = require('./_base-command.js');

class ScrollPage extends ClientCommand {
  get returnsFullResultObject() {
    return false;
  }

  performAction(callback) {
    this.api.scroll(this.direction, this.steps, callback);
  }

  command(options, callback) {
    this.options = options;

    const {direction, steps} = options || {};
    this.direction = direction || 'down';
    this.steps = steps || 1;

    return super.command(callback);
  }
}

module.exports = ScrollPage;
