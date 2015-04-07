var assertModule = require('assert');

/**
 * Given an element name, returns that element object
 *
 * @param {Object} parent The parent page or section
 * @param {string} elementName Name of element
 * @returns {Object} The element object
 */
function getElement(parent, elementName) {
  if (!(elementName in parent.elements)) {
    throw new Error(elementName + ' was not found in "' + parent.name +
      '". Available properties: ' + Object.keys(parent.elements));
  }
  return parent.elements[elementName];
}

/**
 * Calls useXpath or useCss if the locate strategy for an element is different from that currently set on client
 *
 * Uses `useXpath` and `useCss` commands.
 * @param {Object} parent The parent page or section
 * @param {string} desiredStrategy (css selector|xpath)
 * @returns {null}
 */
function setLocateStrategy(parent, desiredStrategy) {
  if (parent.client.locateStrategy !== desiredStrategy) {
    if (desiredStrategy === 'xpath') {
      parent.api.useXpath();
    }
    else if (desiredStrategy === 'css selector') {
      parent.api.useCss();
    }
  }
}

/**
 * Retrieves an array of assertion methods that do not take element selector as its first argument
 *
 * @returns {Array}
 */
function getNonElementAssertions() {
  var nonElementAssertions = ['title', 'urlContains', 'urlEquals'];
  for (var prop in assertModule) {
    if (assertModule.hasOwnProperty(prop)) {
      nonElementAssertions.push(prop);
    }
  }
  return nonElementAssertions;
}

/**
 * Creates a closure that enables calling commands and assertions on the page or section.
 * For all commands and assertions that take a selector as their first arg, it calls it with all passed arguments with one tweak -
 *  it first replaces the first argument (element name) with the element's selector.
 *  If the command or assertion does not take a selector as its first arg, it calls it with the untouched passed arguments
 *
 * @param {Object} parent The parent page or section
 * @param {function} command The actual command function
 * @param {string} commandName The name of the command ("click", "containsText", etc)
 * @returns {parent}
 */
function makeWrappedCommand(parent, command, commandName) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var nonElementAssertions = getNonElementAssertions();
    if (nonElementAssertions.indexOf(commandName) <= -1) {
      var elementName = arguments[0],
        element = getElement(parent, elementName);

      setLocateStrategy(parent, element.locateStrategy);
      args.shift();
      args.unshift(element.selector);
    }
    command.apply(parent.client, args);
    return parent;
  };
}

/**
 * Adds commands (elements commands, assertions, etc) to the page or section
 *
 * @param {Object} parent The parent page or section
 * @param {Object} target What the command is added to (parent|section or assertion object on parent|section)
 * @param {Array} commands
 * @returns {null}
 */
function applyCommandsToTarget(parent, target, commands) {
  for (var commandName in commands) {
    if (commandName === 'assert' || commandName === 'verify') {
      target[commandName] = target[commandName] || {};
      applyCommandsToTarget(parent, target[commandName], commands[commandName]);
    } else if (commands.hasOwnProperty(commandName)) {
      if (target[commandName]) {
        parent.results.errors++;
        var error = new Error('The command "' + commandName + '" is already defined!');
        parent.errors.push(error.stack);
        throw error;
      }
      target[commandName] = makeWrappedCommand(parent, commands[commandName], commandName);
    }
  }
}

/**
 * Entrypoint to add commands (elements commands, assertions, etc) to the page or section
 *
 * @param {Object} parent The parent page or section
 * @param {function} commandLoader function that retrieves commands
 * @returns {null}
 */
function addWrappedCommands(parent, commandLoader) {
  var commands = {};
  commands = commandLoader(commands);
  applyCommandsToTarget(parent, parent, commands);
}

module.exports = {
  addWrappedCommands: addWrappedCommands
};
