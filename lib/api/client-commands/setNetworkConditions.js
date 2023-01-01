const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * 
 * Command to set Chrome network emulation settings.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.setNetworkConditions({
 *      offline: false,
 *      latency: 50000,
 *      download_throughput: 450 * 1024,
 *      upload_throughput: 150 * 1024
 *    });
 *  };
 *
 *
 * @method setNetworkConditions
 * @syntax .setNetworkConditions(spec, [callback])
 * @param {object} spec
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.sessions
 */
class SetNetworkConditions extends ClientCommand {
  performAction(callback) {

    if (!this.api.isChrome() && !this.api.isEdge()) {
      const error = new Error('SetNetworkConditions is not supported while using this driver');
      Logger.error(error);

      return callback(error);
    }

    const {spec} = this;

    this.transportActions
      .setNetworkConditions(spec, callback)
      .then((result) => {
        callback(result);
      })
      .catch((err) => {
        return err;
      });
  }

  command(spec, callback) {
    this.spec = spec;

    return super.command(callback);
  }
}

module.exports = SetNetworkConditions;
