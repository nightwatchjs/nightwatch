const ProtocolAction = require('./_base-action.js');
const {isString} = require('../../utils');
const {By} = require('selenium-webdriver');

/**
 * Change focus to another frame on the page. If the frame id is missing or null, the server should switch to the page's default content.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.frame('<ID>', function(result) {
 *      console.log(result);
 *    });
 *  }
 *  
 *  this.demoTest = function (browser) {
 *    browser.frame('<NAME>', function(result) {
 *      console.log(result);
 *    });
 *  }
 *
 * @link /#switch-to-frame
 * @param {string|number|null} [frameId] Identifier for the frame to change focus to.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.frames
 */
module.exports = class Session extends ProtocolAction {
  async command(frameId, callback) {
    if (arguments.length === 1 && typeof frameId === 'function') {
      callback = frameId;

      return this.transportActions.switchToFrame(callback);
    } 
    
    if (arguments.length === 2 && isString(frameId)){ 
      try {
        frameId = await this.driver.findElement(By.css(`#${frameId}, *[name="${frameId}"]`));
      } catch (err){
        return {
          status: -1,
          error: err
        };
      }
    }

    return this.transportActions.switchToFrame(frameId, callback);
  }
};
