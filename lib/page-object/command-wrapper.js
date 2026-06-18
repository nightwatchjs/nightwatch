const Element = require('../element');
const Utils = require('../utils');

const ALLOWED_NAMESPACES = [
  'alerts', 'cookies', 'document',
  'assert', 'verify', 'expect'
];

function isAllowedNamespace(commandName) {
  return ALLOWED_NAMESPACES.indexOf(commandName) > -1;
}

class Command {
  static get TYPE_ELEMENT() {
    return 'element';
  }

  static get TYPE_SECTION() {
    return 'section';
  }

  static isPossibleElementSelector(item, commandName = '') {
    if (!item) {
      return false;
    }

    if (Array.isArray(item)) {
      return false;
    }

    if (Utils.isObject(item)) {
      return item.hasOwnProperty('selector') && Utils.isString(item.selector);
    }

    const Api = require('../api');
    const ScopedElementApi = require('../api/_loaders/element-api');

    return Utils.isString(item) && (item.startsWith('@') || Api.isElementCommand(commandName) || ScopedElementApi.isScopedElementCommand(commandName));
  }

  static isUserDefinedElementCommand(commandName) {
    const ApiLoader = require('../api');

    return !ApiLoader.getElementsCommandsStrict().includes(commandName);
  }

  constructor(parent, commandName, isChaiAssertion, isES6Async = false) {
    this.parent = parent;
    this.commandName = commandName;
    this.isChaiAssertion = isChaiAssertion;
    this.isES6Async = isES6Async;
    this.isUserDefined = Command.isUserDefinedElementCommand(commandName);
  }

  createWrapper(commandFn) {
    const self = this;

    return function (...args) {

      if (args.length > 0 && this.__needsRecursion) {
        const inputElement = Element.createFromSelector(args[0]);

        if (self.isUserDefined) {
          inputElement.container = this.__element;
          args[0] = inputElement;
        } else {
          args[0] = Element.createFromSelector({
            locateStrategy: 'recursion',
            selector: [this.__element, inputElement]
          });
        }
      }

      const client = this.client || self.parent && self.parent.client || {};
      const result = self.executeCommand(commandFn, args, client);

      if (self.isChaiAssertion) {
        return result;
      }

      const {isES6AsyncTestcase} = client;

      if ((result instanceof Promise) && (self.parent.constructor.name === 'Page' || isES6AsyncTestcase)) {
        Object.assign(result, self.parent);

        const parentPrototype = Object.getPrototypeOf(self.parent);
        Object.getOwnPropertyNames(parentPrototype).forEach((propertyName) => {
          if (propertyName === 'constructor') {
            return;
          }
          const propertyDescriptor = Object.getOwnPropertyDescriptor(parentPrototype, propertyName);
          Object.defineProperty(result, propertyName, propertyDescriptor);
        });

        return result;
      }

      return self.parent;
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
        target = available = this.parent.sections; // Corrected to 'sections' from 'section'
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

  getElement(elementName, strategy = null) {
    this.validate(elementName, strategy, Command.TYPE_ELEMENT);

    return this.parent.elements[elementName];
  }

  getSection(sectionName, strategy = null) {
    this.validate(sectionName, strategy, Command.TYPE_SECTION);

    return this.parent.sections[sectionName]; // Corrected to 'sections' from 'section'
  }

  getSelectorFromArgs(args) {
    let selectorArg = args[0];

    const isSelector = Command.isPossibleElementSelector(selectorArg, this.commandName);
    if (isSelector) {
      const {LocateStrategy} = Utils;
      const isStrategySpecified = LocateStrategy.isValid(selectorArg);
      if (isStrategySpecified && Utils.isString(args[1])) {
        selectorArg = {
          selector: args[1],
          locateStrategy: args[0]
        };
      }

      return selectorArg;
    }

    return null;
  }

  parseElementSelector(args) {
    const selector = this.getSelectorFromArgs(args);

    if (!selector) {
      return;
    }

    let inputElement = Element.createFromSelector(selector);

    if (inputElement.hasElementSelector()) {
      const nameSections = inputElement.selector.substring(1).split(':');
      const name = nameSections[0];
      const pseudoSelector = nameSections[1] || null;

      const isSectionSelector = this.isChaiAssertion && this.commandName === 'section';

      const getter = isSectionSelector ? this.getSection : this.getElement;

      const strategy = Utils.isObject(selector) && selector.locateStrategy || null;
      const elementOrSection = getter.call(this, name, strategy);
      elementOrSection.pseudoSelector = pseudoSelector;

      Element.copyDefaults(inputElement, elementOrSection);
      inputElement.locateStrategy = elementOrSection.locateStrategy;
      inputElement.selector = elementOrSection.selector; 
      inputElement = inputElement.getRecursiveLookupElement() || inputElement;
      args[0] = inputElement;
    } else {
      const Section = require('./section.js');
      if (this.parent instanceof Section) {
        inputElement.parent = this.parent;
        inputElement = inputElement.getRecursiveLookupElement() || Element.createFromSelector({
          locateStrategy: 'recursion',
          selector: [this.parent, inputElement]
        });

        const ScopedElementApi = require('../api/_loaders/element-api');
        if (ScopedElementApi.isScopedElementCommand(this.commandName)) {
          this.onlyLocateSectionsRecursively = true;
        }

        args[0] = inputElement;
      }
    }
  }

  executeCommand(commandFn, args, context) {
    let parseArgs;
    if (Utils.isObject(args[0]) && Array.isArray(args[0].args)) {
      parseArgs = args[0].args;
    } else {
      parseArgs = args;
    }

    this.parseElementSelector(parseArgs);

    return commandFn.apply(context, args);
  }
}

class CommandLoader {

  static addWrappedCommands(parent, commandLoader) {
    const commands = {
      get '__pageObjectItem__' () {
        return parent;
      }
    };

    const wrappedCommands = commandLoader(commands);

    CommandLoader.applyCommandsToTarget(parent, parent, wrappedCommands);
    if (parent.assert && parent.verify) {
      const ApiLoader = require('../api');
      parent.assert = ApiLoader.makeAssertProxy(parent.assert);
      parent.verify = ApiLoader.makeAssertProxy(parent.verify);
    }
  }

  static addWrappedCommandsAsync(parent, commandLoader) {
    const commands = {};

    const wrappedCommands = commandLoader(commands);
    CommandLoader.applyCommandsToTarget(parent, parent, wrappedCommands);

    return wrappedCommands;
  }

  static applyCommandsToTarget(parent, target, commands) {
    Object.keys(commands).forEach(function(commandName) {
      if (isAllowedNamespace(commandName)) {
        target[commandName] = target[commandName] || {};

        const isChaiAssertion = commandName === 'expect';
        const namespace = commands[commandName];

        Object.keys(namespace).forEach(function(nsCommandName) {
          target[commandName][nsCommandName] = CommandLoader.addCommand({
            target: target[commandName],
            commandFn: namespace[nsCommandName],
            commandName: nsCommandName,
            parent,
            isChaiAssertion
          });
        });
      } else {
        if (Utils.isObject(commands[commandName])) {
          return;
        }

        target[commandName] = CommandLoader.addCommand({
          target,
          commandFn: commands[commandName],
          commandName,
          parent,
          isChaiAssertion: false,
          isES6Async: Utils.isES6AsyncFn(commands[commandName])
        });
      }
    });
  }

  static wrapElementCommand(parent, originalApi, targetApi, commandName) {
    const originalFn = originalApi[commandName];

    const command = new Command(parent, commandName, false);

    return function(...args) {
      return command.createWrapper(originalFn).apply(this, args);
    };
  }

  static wrapProtocolCommand(parent, originalApi, targetApi, commandName) {
    const originalFn = originalApi[commandName];

    const command = new Command(parent, commandName, false, true);

    return function(...args) {
      return command.createWrapper(originalFn).apply(this, args);
    };
  }

  static wrapScopedElementApi(parent, api, scopedElementApi) {
    Object.keys(scopedElementApi).forEach(function(commandName) {
      const command = new Command(parent, commandName, false);
      api[commandName] = command.createWrapper(scopedElementApi[commandName]);
    });
  }
}

module.exports = CommandLoader;
