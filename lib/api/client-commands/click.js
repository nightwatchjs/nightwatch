const ClientCommand = require('./_base-command.js');

/**
 * Gets a log from Selenium.
 *
 * @example
 * this.demoTest = function(client) {
 *   this.getLog('browser', function(logEntriesArray) {
 *     console.log('Log length: ' + logEntriesArray.length);
 *     logEntriesArray.forEach(function(log) {
 *        console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
 *      });
 *   });
 * };
 *
 *
 * @method click
 * @syntax .click([typeString], callback)
 * @param {string|function} typeString Log type to request
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.sessions
 * @see clickTypes
 */
class Click extends ClientCommand {
  get returnsFullResultObject() {
    return false;
  }

  get resolvesWithFullResultObject() {
    return false;
  }

  performAction(callback) {
    const {elementSelector} = this;
    
    this.transportActions
      .clickElement(elementSelector, callback)
      .catch(err => {
        return err;
      })
      .then(result => callback(result));
  }

  command(selector = 'body', callback) {
    if (arguments.length === 1 && typeof arguments[0] == 'function') {
      callback = arguments[0];
      selector = 'body';
    }

    this.elementSelector = selector;

    return super.command(callback);
  }
}

module.exports = Click;
