/**
 * A class-based custom-command in Nightwatch. The command name is the filename.
 *
 * Usage:
 *   browser.angular.getElementsInList(listName)
 *
 * See the example test using this object:
 *   specs/with-custom-commands/angularTodo.js
 *
 * For more information on working with custom-commands see:
 *   https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-commands.html
 *
 * @param {string} listName Name of the list
 * @param {function} cb Callback to be called with the result returned by the executed script
 */

module.exports = class AngularCommand {

  async command(listName, cb = function(r) {return r}) {
    // Script to be executed in the browser
    const script = function(listName) {
      // executed in the browser context
      // eslint-disable-next-line
      var elements = document.querySelectorAll('*[ng-repeat$="'+listName+'"]');

      if (elements) {return elements}

      return null;
    };

    // Arguments to be passed to the script function above
    const args = [listName];

    // Callback to be called when the script finishes its execution,
    // with the result returned by the script passed as argument.
    const callback = async function(result) {
      const cbResult = await cb(result);

      if (cbResult.value) {
        return cbResult.value;
      }

      return cbResult;
    };

    // Execute the script defined above, along with arguments and
    // the callback function.
    return this.api.executeScript(script, args, callback);
  }
};
