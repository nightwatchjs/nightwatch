const ClientCommand = require('../_base-command.js');
const {Logger} = require('../../../utils');

/**
 * Automate the input of basic auth credentials whenever they arise.
 *
 * @example
 * module.exports = {
 *   'input basic auth credentials': function (browser) {
 *     browser
 *       .alerts.registerBasicAuth('admin', 'admin')
 *      .navigateTo('https://the-internet.herokuapp.com/basic_auth');
 *   }
 * };
 *
 * @syntax .alerts.registerBasicAuth(username, password, [callback])
 * @method alerts.registerBasicAuth
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
      const error =  new Error('RegisterBasicAuth is not supported while using this driver');
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
