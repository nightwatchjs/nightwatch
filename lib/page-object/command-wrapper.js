const Element = require('./element.js');
const Reporter = require('../core/reporter.js');

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

  validate(elementOrSection, type) {
    let target = null;
    let available = null;
    let typeAvailable = 'elements';

    switch (type) {
      case Command.TYPE_ELEMENT:
        target = available = this.parent.elements;
        break;
      case Command.TYPE_SECTION:
        target = this.parent.section;
        available = this.parent.sections;
        typeAvailable = 'sections';
        break;
    }


    if (!(elementOrSection in target)) {
      throw new Error(`${elementOrSection} was not found in "${this.parent.name}". Available ${typeAvailable}: ${Object.keys(available)}`);
    }
  }

  /**
   * Given an element name, returns that element object
   *
   * @param {string} elementName Name of element
   * @returns {Object} The element object
   */
  getElement(elementName) {
    elementName = elementName.substring(1);
    this.validate(elementName, Command.TYPE_ELEMENT);

    return this.parent.elements[elementName];
  }

  /**
   * Given a section name, returns that section object
   *
   * @param {string} sectionName Name of section
   * @returns {Object} The section object
   */
  getSection(sectionName) {
    sectionName = sectionName.substring(1);

    this.validate(sectionName, Command.TYPE_SECTION);

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
      let elementOrSection = getter.call(this, inputElement.selector);

      Element.copyDefaults(inputElement, elementOrSection);
      inputElement.selector = elementOrSection.selector; // force replacement of @-selector
      inputElement = inputElement.getRecursiveLookupElement() || inputElement;

      args[0] = inputElement;
    }
  }

  /**
   *
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
      //parent.client.results.errors++;
      //parent.client.errors.push(error.stack);

      let error = new Error(`The command "${commandName}" is already defined.`);
      Reporter.registerTestError(error);
      throw error;

    }

    let command = new Command(parent, commandName, isChaiAssertion);

    return command.createWrapper(commandFn);
  }
}

module.exports = CommandLoader;
