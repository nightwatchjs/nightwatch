const ClientCommand = require('./_baseCommand.js');

/**
 * This command is an alias to url and also a convenience method when called without any arguments in the sense that it performs a call to .url() with passing the value of `launch_url` field from the settings file.
 * Uses `url` protocol command.
 *
 * @example
 * this.demoTest = function (client) {
 *   client.init();
 * };
 *
 *
 * @method init
 * @param {string} [url] Url to navigate to.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see url
 * @api protocol.navigation
 */
class Init extends ClientCommand {
  get returnsFullResultObject() {
    return true;
  }

  performAction(callback) {
    this.api.window('DELETE', callback);
  }

  command(url, callback) {
    if (typeof arguments[0] == 'function') {
      callback = arguments[0];
      url = this.api.launchUrl;
    }

    this.url = url;

    return super.command(callback);
  }
}

module.exports = Init;
