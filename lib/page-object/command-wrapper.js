var Element = require('./element.js');

module.exports = new (function() {

  /**
   * Given an element name, returns that element object
   *
   * @param {Object} parent The parent page or section
   * @param {string} elementName Name of element
   * @returns {Object} The element object
   */
  function getElement(parent, elementName) {
    elementName = elementName.substring(1);
    if (!(elementName in parent.elements)) {
      throw new Error(elementName + ' was not found in "' + parent.name +
        '". Available elements: ' + Object.keys(parent.elements));
    }
    return parent.elements[elementName];
  }

  /**
   * Given a section name, returns that section object
   *
   * @param {Object} parent The parent page or section
   * @param {string} sectionName Name of section
   * @returns {Object} The section object
   */
  function getSection(parent, sectionName) {
    sectionName = sectionName.substring(1);
    if (!(sectionName in parent.section)) {
      throw new Error(sectionName + ' was not found in "' + parent.name +
        '". Available sections: ' + Object.keys(parent.sections));
    }
    return parent.section[sectionName];
  }

  /**
   * Creates a closure that enables calling commands and assertions on the page or section.
   * For all element commands and assertions, it fetches element's selector and locate strategy
   *  For elements nested under sections, it sets 'recursion' as the locate strategy and passes as its first argument to the command an array of its ancestors + self
   *  If the command or assertion is not on an element, it calls it with the untouched passed arguments
   *
   * @param {Object} parent The parent page or section
   * @param {function} commandFn The actual command function
   * @param {string} commandName The name of the command ("click", "containsText", etc)
   * @param {Boolean} [isChaiAssertion]
   * @returns {function}
   */
  function makeWrappedCommand(parent, commandFn, commandName, isChaiAssertion) {

    var isSectionSelector = isChaiAssertion && commandName === 'section';

    return function() {
      var args = Array.prototype.slice.call(arguments);
      parseElementSelector(args, parent, isSectionSelector);
      var result = commandFn.apply(parent.client, args);
      return isChaiAssertion ? result : parent;
    };
  }

  /**
   * Identifies element references (@-prefixed selectors) within an argument
   * list and converts it into an element object with the appropriate
   * selector or recursion chain of selectors.
   *
   * @param {Array} args The argument list to check for an element selector.
   * @param {Object} parent The parent page or section.
   * @param {boolean} isSectionSelector When true, indicates that the selector references
   *    a selector within a section rather than an elements definition.
   */
  function parseElementSelector (args, parent, isSectionSelector) {

    // currently only support first argument for @-elements
    var possibleElementSelector = args[0];
    var inputElement = possibleElementSelector && Element.fromSelector(possibleElementSelector);
    if (inputElement && inputElement.hasElementSelector()) {

      var getter = isSectionSelector ? getSection : getElement;
      var elementOrSection = getter(parent, inputElement.selector);

      Element.copyDefaults(inputElement, elementOrSection);
      inputElement.selector = elementOrSection.selector; // force replacement of @-selector

      inputElement = inputElement.getRecursiveLookupElement() || inputElement;
      args[0] = inputElement;
    }
  }

  /**
   * Adds commands (elements commands, assertions, etc) to the page or section
   *
   * @param {Object} parent The parent page or section
   * @param {Object} target What the command is added to (parent|section or assertion object on parent|section)
   * @param {Object} commands
   * @returns {null}
   */
  function applyCommandsToTarget(parent, target, commands) {

    Object.keys(commands).forEach(function(commandName) {
      if (isValidAssertion(commandName)) {
        target[commandName] = target[commandName] || {};

        var isChaiAssertion = commandName === 'expect';
        var assertions = commands[commandName];

        Object.keys(assertions).forEach(function(assertionName) {
          target[commandName][assertionName] = addCommand(target[commandName], assertions[assertionName], assertionName, parent, isChaiAssertion);
        });
      } else {
        target[commandName] = addCommand(target, commands[commandName], commandName, parent, false);
      }
    });
  }

  function addCommand(target, commandFn, commandName, parent, isChaiAssertion) {
    if (target[commandName]) {
      parent.client.results.errors++;
      var error = new Error('The command "' + commandName + '" is already defined!');
      parent.client.errors.push(error.stack);
      throw error;
    }

    return makeWrappedCommand(parent, commandFn, commandName, isChaiAssertion);
  }

  function isValidAssertion(commandName) {
    return ['assert', 'verify', 'expect'].indexOf(commandName) > -1;
  }

  /**
   * Entrypoint to add commands (elements commands, assertions, etc) to the page or section
   *
   * @param {Object} parent The parent page or section
   * @param {function} commandLoader function that retrieves commands
   * @returns {null}
   */
  this.addWrappedCommands = function (parent, commandLoader) {
    var commands = {};
    commands = commandLoader(commands);
    applyCommandsToTarget(parent, parent, commands);
  };

})();
