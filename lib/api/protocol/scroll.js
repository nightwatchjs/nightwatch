const ProtocolAction = require('./_base-action.js');

module.exports = class Action extends ProtocolAction {
  command(direction, steps, callback) {
    if (!['up', 'down'].includes(direction)) {
      throw new Error(`Wrong direction in scroll ${direction}.`);
    }

    if (steps < 0) {
      throw new Error(`Scroll steps cannot be negative ${steps}.`);
    }

    return this.transportActions.scrollPage(direction, steps, callback);
  }
};
