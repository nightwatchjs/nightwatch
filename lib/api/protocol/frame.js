const ProtocolAction = require('./_base-action.js');

/**
 * Change focus to another frame on the page.
 *
 * Changes the focus of all future commands to another frame on the page. The
 * target frame may be specified as one of the following:
 *
 * - A number that specifies a (zero-based) index into [window.frames](
 *   https://developer.mozilla.org/en-US/docs/Web/API/Window.frames)
 * - An element (css selector) which correspond to a `frame` or `iframe`
 *   DOM element
 * - The `null` value, to select the topmost frame on the page.
 *
 * If the specified frame can not be found, a `NoSuchFrameError` will be thrown
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.frame('<ID>', function(result) {
 *      console.log(result);
 *    });
 * }
 *
 * @link /#switch-to-frame
 * @param {string|number|null} [frameId] Identifier for the frame to change focus to.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.frames
 */
const findElement = function(selector) {
  
  return new Promise((resolve, reject) => {
    this.api.findElement({selector, suppressNotFoundErrors: true}, function(res) {
      if (res.status === -1 && res.error) {
        return reject(res.error);
      }

      resolve(res.value);
    });
  });
};

module.exports = class Session extends ProtocolAction {
  async command(frameId, callback) {
    if (arguments.length === 1 && typeof frameId === 'function') {
      callback = frameId;

      return this.transportActions.switchToFrame(callback);
    }

    if (typeof frameId == 'string') {
      frameId = await findElement.call(this, frameId)
        .catch(err => {
          return findElement.call(this, `*[name="${frameId}"]`);
        })
        .catch(err => {
          return findElement.call(this, `*[id="${frameId}"]`);
        })
        .catch(err => {
          throw new Error(`Unable to locate frame element ${frameId}.`);
        });

      delete frameId['getId'];
      frameId.ELEMENT = frameId[Object.keys(frameId)[0]];
    }

    return this.transportActions.switchToFrame(frameId, callback);
  }
};
