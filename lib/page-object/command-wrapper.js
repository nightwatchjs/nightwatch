const Element = require('./element.js');
const Utils = require('../util/utils.js');

function isValidAssertion(commandName) {
  return ['assert', 'verify', 'expect'].indexOf(commandName) > -1;
}

class Command {
  static get TYPE_ELEMENT() {
    return 'element';
  }

  static get TYPE_SECTION() {
    return 'section';
  }

  constructor(parent, commandName, isChaiAssertion) {
    this.parent = parent;
    this.commandName = commandName;
    this.isChaiAssertion = isChaiAssertion;
  }

  /**
   * Creates a closure that enables calling commands and assertions on the page or section.
   * For all element commands and assertions, it fetches element's selector and locate strategy
   *  For elements nested under sections, it sets 'recursion' as the locate strategy and passes as its first argument to the command an array of its ancestors + self
   *  If the command or assertion is not on an element, it calls it with the untouched passed arguments
   *
   * @param {function} commandFn The actual command function
   * @returns {function}
   */
  createWrapper(commandFn) {
    let self = this;

    return function(...args) {
      let result = self.executeCommand(commandFn, args);

      return self.isChaiAssertion ? result : self.parent;
    };
  }

  validate(elementOrSection, strategy, type) {
    let target = null;
    let available = null;
    let typeAvailable = 'elements';
    let prefix;
    let showStrategy = '';
    let showAvailable;

    switch (type) {
      case Command.TYPE_ELEMENT:
        target = available = this.parent.elements;
        prefix = 'Element';
        break;
      case Command.TYPE_SECTION:
        target = available = this.parent.section;
        typeAvailable = 'sections';
        prefix = 'Section';
        break;
    }

    let isValid = false;
    if (elementOrSection in target) {
      isValid = true;
    }

    if (isValid && strategy) {
      isValid = target[elementOrSection].locateStrategy && target[elementOrSection].locateStrategy === strategy;
    }

    if (!isValid) {
      showAvailable = Object.keys(available);
      if (strategy) {
        showStrategy = `[locateStrategy='${strategy}']`;
        showAvailable = showAvailable.map(item => `${item}[locateStrategy='${target[item].locateStrategy}']`);
      }

      throw new Error(`${prefix} "${elementOrSection}${showStrategy}" was not found in "${this.parent.name}". Available ${typeAvailable}: ${showAvailable.join(', ')}`);
    }
  }

  /**
   * Given an element name, returns that element object
   *
   * @param {string} elementName Name of element
   * @param {string} [strategy]
   * @returns {Element} The element object
   */
  getElement(elementName, strategy = null) {
    elementName = elementName.substring(1);
    this.validate(elementName, strategy, Command.TYPE_ELEMENT);

    return this.parent.elements[elementName];
  }

  /**
   * Given a section name, returns that section object
   *
   * @param {string} sectionName Name of section
   * @param {string} [strategy]
   * @returns {Element} The section object
   */
  getSection(sectionName, strategy = null) {
    sectionName = sectionName.substring(1);

    this.validate(sectionName, strategy, Command.TYPE_SECTION);

    return this.parent.section[sectionName];
  }

  /**
   * Identifies element references (@-prefixed selectors) within an argument
   * list and converts it into an element object with the appropriate
   * selector or recursion chain of selectors.
   *
   * @param {Array} args The argument list to check for an element selector.
   */
  parseElementSelector(args) {
    // When true, indicates that the selector references a selector within a section rather than an elements definition.
    let isSectionSelector = this.isChaiAssertion && this.commandName === 'section';

    // currently only support first argument for @-elements
    let possibleElementSelector = args[0];
    let inputElement = possibleElementSelector && Element.createFromSelector(possibleElementSelector);

    if (inputElement && inputElement.hasElementSelector()) {

      let getter = isSectionSelector ? this.getSection : this.getElement;
      let strategy = Utils.isObject(possibleElementSelector) && possibleElementSelector.locateStrategy || null;
      let elementOrSection = getter.call(this, inputElement.selector, strategy);

      Element.copyDefaults(inputElement, elementOrSection);
      inputElement.locateStrategy = elementOrSection.locateStrategy;
      inputElement.selector = elementOrSection.selector; // force replacement of @-selector
      inputElement = inputElement.getRecursiveLookupElement() || inputElement;

      args[0] = inputElement;
    }
  }

  /**
   * @param {Function} commandFn
   * @param {Array} args
   */
  executeCommand(commandFn, args) {

    this.parseElementSelector(args);

    return commandFn.apply(this.parent.client, args);
  }
}

class CommandLoader {

  /**
   * Entry point to add commands (elements commands, assertions, etc) to the page or section
   *
   * @param {Object} parent The parent page or section
   * @param {function} commandLoader function that retrieves commands
   * @returns {null}
   */
  static addWrappedCommands(parent, commandLoader) {
    let commands = {};
    let wrappedCommands = commandLoader(commands);

    CommandLoader.applyCommandsToTarget(parent, parent, wrappedCommands);
  }

  /**
   * Adds commands (elements commands, assertions, etc) to the page or section
   *
   * @param {Object} parent The parent page or section
   * @param {Object} target What the command is added to (parent|section or assertion object on parent|section)
   * @param {Object} commands
   * @returns {null}
   */
  static applyCommandsToTarget(parent, target, commands) {

    Object.keys(commands).forEach(function(commandName) {
      if (isValidAssertion(commandName)) {
        target[commandName] = target[commandName] || {};

        let isChaiAssertion = commandName === 'expect';
        let assertions = commands[commandName];

        Object.keys(assertions).forEach(function(assertionName) {
          target[commandName][assertionName] = CommandLoader.addCommand(target[commandName], assertions[assertionName], assertionName, parent, isChaiAssertion);
        });
      } else {
        target[commandName] = CommandLoader.addCommand(target, commands[commandName], commandName, parent, false);
      }
    });
  }

  static addCommand(target, commandFn, commandName, parent, isChaiAssertion) {
    if (target[commandName]) {
      throw new Error(`The command "${commandName}" is already defined.`);
    }

    let command = new Command(parent, commandName, isChaiAssertion);

    return command.createWrapper(commandFn);
  }
}

module.exports = CommandLoader;
