const ProtocolAction = require('../_base-action.js');

/**
 * Utility command to load an external script into the page specified by url.
 *
 * @example
 * module.exports = {
 *   'inject external script': function (browser) {
 *      browser.document.injectScript('<script-url>', function () {
 *        console.log('script injected successfully');
 *      });
 *   },
 *
 *   'inject external script using ES6 async/await': async function (browser) {
 *      await browser.document.injectScript('<script-url>', 'injected-script');
 *   }
 * }
 *
 * @syntax .document.injectScript(scriptUrl, [callback])
 * @syntax .document.injectScript(scriptUrl, id, [callback])
 * @method document.injectScript
 * @param {string} scriptUrl The script file url
 * @param {string} [id] DOM element id to be set on the script tag.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @returns {HTMLScriptElement} The newly created script tag.
 * @api protocol.document
 */
module.exports = class InjectScript extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(scriptUrl, id, callback) {
    const args = [scriptUrl];

    if (arguments.length === 2 && typeof arguments[1] == 'function') {
      callback = arguments[1];
    } else if (typeof id == 'string') {
      args.push(id);
    }

    // eslint-disable-next-line
    const script = function(u,i) {return (function(d){var e=d.createElement('script');var m=d.getElementsByTagName('head')[0];e.src=u;if(i){e.id=i;}m.appendChild(e);return e;})(document);};

    return this.executeScriptHandler('executeScript', script, args, callback);
  }
};
