const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Automate the input of basic auth credentials whenever they arise.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser
 *      .registerBasicAuth('test-username', 'test-password')
 *      .navigateTo('http://browserspy.dk/password-ok.php');
 *  };
 *
 * @method registerBasicAuth
 * @param {string} username
 * @param {string} password
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 */
class RegisterBasicAuth extends ClientCommand {

  performAction(callback) {
    if (!this.client.api.isChrome() && !this.client.api.isEdge()){
      const error = new Error('The command .registerBasicAuth() is only supported while using Chrome or Edge drivers.');
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
