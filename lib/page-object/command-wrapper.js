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

/* Calls use(Css|Xpath|Recursion) command
 *
 * Uses `useXpath`, `useCss`, and `useRecursion` commands.
 * @param {Object} parent The parent page or section
 * @param {string} desiredStrategy (css selector|xpath|recursion)
 * @returns {null}
 */
function setLocateStrategy(client, desiredStrategy) {
  if (desiredStrategy === 'xpath') {
    client.api.useXpath();
  } else if (desiredStrategy === 'css selector') {
    client.api.useCss();
  } else if (desiredStrategy === 'recursion') {
    client.api.useRecursion();
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
 * For all element commands and assertions, it fetches element's selector and locate strategy
 *  For elements nested under sections, it sets 'recursion' as the locate strategy and passes as its first argument to the command an array of its ancestors + self
 *  If the command or assertion is not on an element, it calls it with the untouched passed arguments
 *
 * @param {Object} parent The parent page or section
 * @param {function} command The actual command function
 * @param {string} commandName The name of the command ("click", "containsText", etc)
 * @returns {parent}
 */
function makeWrappedCommand(parent, command, commandName) {
  return function() {
    var args = Array.prototype.slice.call(arguments);

    if (getNonElementAssertions().indexOf(commandName) <= -1) {
      var firstArg, desiredStrategy;
      var elementName = args.shift();
      var element = getElement(parent, elementName);
      var elementAncestors = getAncestorsWithElement(element);
      if (elementAncestors.length === 1) {
        firstArg = element.selector;
        desiredStrategy = element.locateStrategy;
      } else {
        firstArg = elementAncestors;
        desiredStrategy = 'recursion';
      }

      setLocateStrategy(parent.client, desiredStrategy);
      args.unshift(firstArg);
    }

    command.apply(parent.client, args);
    return parent;
  };
}

/**
 * Retrieves an array of ancestors of the supplied element. The last element in the array is the element object itself
 *
 * @param {Object} element The element
 * @returns {Array}
 */
function getAncestorsWithElement(element) {
  var elements = [];
  function addElement(e) {
    elements.unshift(e);
    if (e.parent && e.parent.selector) {
      addElement(e.parent);
    }
  }
  addElement(element);
  return elements;
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
