const ProtocolAction = require('../_base-action.js');

/**
 * Retrieve the list of all window handles available to the session.
 *
 * @example
 * module.exports = {
 *  'get all window handles': function (browser) {
 *     browser.window.getAllHandles(function (result) {
 *       console.log('available window handles are:', result.value);
 *     });
 *   },
 *
 *   'get all window handles with ES6 async/await': async function (browser) {
 *     const windowHandles = await browser.window.getAllHandles();
 *     console.log('available window handles are:', windowHandles);
 *   }
 * }
 *
 * @syntax .window.getAllHandles([callback])
 * @method window.getAllHandles
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string[]} An array of all available window handles.
 * @see window.getHandle
 * @see window.switchTo
 * @link /#get-window-handles
 * @api protocol.window
 */
module.exports = class Action extends ProtocolAction {
  command(callback) {
    return this.transportActions.getAllWindowHandles(callback);
  }
};
