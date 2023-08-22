const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Automate the input of basic auth credentials whenever they arise.
 * This feature is currently implemented on top of Selenium 4’s CDP(Chrome DevTools Protocol) support, and so only works on those browser that support that protocol
 *
 * @example
 * module.exports = {
 *   'input basic auth credentials': function (browser) {
 *     browser
 *       .registerBasicAuth('admin', 'admin')
 *       .navigateTo('https://the-internet.herokuapp.com/basic_auth');
 *   }
 * };
 *
 * @syntax .registerBasicAuth(username, password, [callback])
 * @method registerBasicAuth
 * @param {string} username
 * @param {string} password
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.userprompts
 */
class RegisterBasicAuth extends ClientCommand {
  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('The command .registerBasicAuth() is only supported in Chromium based drivers');
      Logger.error(error);

      return callback(error);
    }

    const {username, password} = this;

    this.transportActions
      .registerAuth(username, password, callback)
      .catch(err => {
        return err;
      })
      .then(result => callback(result));
  }

  command(username, password, callback) {
    this.username = username;
    this.password = password;

    return super.command(callback);
  }
}

module.exports = RegisterBasicAuth;
