const ClientCommand = require('./_base-command.js');

/**
 * Automate the input of basic auth credentials whenever they arise.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.registerBasicAuth(1000, 800);
 *    browser.url('https://page-needs-auth-credentials.com');
 *  };
 *
 *
 * @method registerBasicAuth
 * @param {string} username The new window width.
 * @param {string} password The new window height.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 */
class RegisterBasicAuth extends ClientCommand {

  performAction(callback) {
    const {username, password} = this;

    this.transportActions.registerAuth(
      username,
      password,
      callback
    ).catch(err => {
      return err;
    }).then(result => callback(result));

  }

  command(username, password, callback) {
    this.username = username;
    this.password = password;

    return super.command(callback);
  }
}

module.exports = RegisterBasicAuth;
