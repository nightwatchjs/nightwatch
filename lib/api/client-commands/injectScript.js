const ClientCommand = require('./_baseCommand.js');

/**
 * Utility command to load an external script into the page specified by url.
 *
 * @example
 * this.demoTest = function(client) {
 *   this.injectScript("{script-url}", function() {
 *     // we're all done here.
 *   });
 * };
 *
 *
 * @method injectScript
 * @param {string} scriptUrl The script file url
 * @param {string} [id] Dom element id to be set on the script tag.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.document
 * @returns {HTMLScriptElement} The newly created script tag.
 */
class InjectScript extends ClientCommand {

  performAction(callback) {
    // eslint-disable-next-line no-undef
    this.api.execute(function(u,i) {/* jshint browser:true */return (function(d){var e=d.createElement('script');var m=d.getElementsByTagName('head')[0];e.src=u;if(i){e.id=i;}m.appendChild(e);return e;})(document);}, this.args, callback);
  }

  command(scriptUrl, id, callback) {
    this.args = [scriptUrl];
    if (arguments.length === 2 && typeof arguments[1] == 'function') {
      callback = arguments[1];
    } else if (typeof id == 'string') {
      this.args.push(id);
    }

    return super.command(callback);
  }
}

module.exports = InjectScript;
