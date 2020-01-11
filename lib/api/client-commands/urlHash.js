const ClientCommand = require('./_base-command.js');

/**
 * Convenience command that adds the specified hash (i.e. url fragment) to the current value of the `launch_url` as set in `nightwatch.json`.
 *
 * @example
 * this.demoTest = function (client) {
 *   client.urlHash('#hashvalue');
 *   // or
 *   client.urlHash('hashvalue');
 * };
 *
 *
 * @method urlHash
 * @param {string} hash The hash to add/replace to the current url (i.e. the value set in the launch_url property in nightwatch.json).
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see url
 * @api protocol.navigation
 */
class UrlHash extends ClientCommand {
  get returnsFullResultObject() {
    return true;
  }

  performAction(callback) {
    this.api.url(this.api.launchUrl + '#' + this.hash, callback);
  }

  command(hash, callback) {
    if (hash.charAt(0) === '#') {
      hash = hash.substring(1);
    }

    this.hash = hash;

    return super.command(callback);
  }
}

module.exports = UrlHash;
