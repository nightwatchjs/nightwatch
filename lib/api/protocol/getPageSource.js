const ProtocolAction = require('./_base-action.js');

/**
 * 
 * @example
 * browser.getPageSource({pageRanges: ["1,2"]})
 * 
 * Get the current browser orientation.
 * 
 * @param {{pageRanges: Array<String>}}} options 
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} base64 value of the page
 */
module.exports = class Session extends ProtocolAction {
  command(options, callback) {
    return this.transportActions.pageSource(options, callback);
  }
};
