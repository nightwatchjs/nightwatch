const ClientCommand = require('../_base-command.js');
const {Logger} = require('../../../utils');

/**
 *
 * Command to set Chrome network emulation settings.
 *
 * @example
 * describe('set network conditions', function() {
 *  it('sets the network conditions',function() {
 *    browser
 *     .network.setConditions({
 *      offline: false,
 *      latency: 3000,
 *      download_throughput: 500 * 1024,
 *      upload_throughput: 500 * 1024
 *    });
 *  });
 * });
 *
 * @method network.setConditions
 * @syntax .setNetworkConditions(spec, [callback])
 * @syntax .network.setConditions(spec, [callback])
 * @param {object} spec
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.sessions
 */
class SetNetworkConditions extends ClientCommand {

  static get namespacedAliases() {
    return 'setNetworkConditions';
  }

  performAction(callback) {
    if (!this.api.isChrome() && !this.api.isEdge()) {
      const error = new Error('The command .setNetworkConditions() is only supported in Chromium based drivers');
      Logger.error(error);

      return callback(error);
    }

    const {spec} = this;

    this.transportActions.setNetworkConditions(spec, callback);
  }

  command(spec, callback) {
    this.spec = spec;

    return super.command(callback);
  }
}

module.exports = SetNetworkConditions;
