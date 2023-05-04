const {Locator} = require('../../element');
const Utils = require('../../utils');
const ScopedWebElement = require('../web-element');
const {By} = require('selenium-webdriver');

class ScopedElementAPILoader {
  static get availableElementCommands() {
    return [
      ['findElement', 'find', 'get'],
      ['findAll'],
      ['findByText'],
      ['findAllByText'],
      ['findByRole'],
      ['findAllByRole'],
      ['findByAltText'],
      ['findAllByAltText'],
      ['findByLabelText'],
      ['findByPlaceholderText'],
      ['findAllByPlaceholderText']
    ];
  }

  static isScopedElementCommand(commandName) {
    return ScopedElementAPILoader.availableElementCommands.some(
      commands => commands.includes(commandName)
    );
  }

  constructor(nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
  }

  createLocatingCommand(name) {
    return Utils.setFunctionName((...args) => {
      const rootElement = ScopedWebElement.root(this.nightwatchInstance, args);

      return rootElement.createRootElementCommand(name, rootElement, args);
    }, name);
  }

  loadElementMethods(target, element) {
    const findActive = () => ScopedWebElement.active(this.nightwatchInstance);
    const exportedElement = Object.assign(target, {
      findActive,
      getActive: findActive
    });

    ScopedElementAPILoader.availableElementCommands.forEach(commandName => {
      let names = commandName;
      if (!Array.isArray(names)) {
        names = [names];
      }

      names.forEach(commandName => {
        Object.defineProperty(exportedElement, commandName, {
          value: this.createLocatingCommand.call(this, commandName, element),
          writable: false
        });
      });
    });

    return exportedElement;
  }

  createElementMethod() {
    const nightwatchInstance = this.nightwatchInstance;

    return this.loadElementMethods(function(...args) {
      let selector = args[0];

      if (args.length >= 2 && Utils.isString(args[0]) && Utils.isString(args[1])) {
        selector = By[Locator.AVAILABLE_LOCATORS[args[0]]](args[1]);
      }

      return ScopedWebElement.create(selector, null, nightwatchInstance);
    });
  }
}

module.exports = ScopedElementAPILoader;
