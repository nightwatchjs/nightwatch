const Utils = require('../../utils');
const {ScopedWebElement} = require('../web-element');

class ScopedElementAPILoader {
  static get availableElementCommands() {
    return [
      ['findElement', 'find', 'get'],
      ['findElements', 'findAll', 'getAll'],
      ['getByText', 'findByText'],
      ['getAllByText', 'findAllByText'],
      ['getByRole', 'findByRole'],
      ['getAllByRole', 'findAllByRole'],
      ['getByAltText', 'findByAltText'],
      ['getAllByAltText', 'findAllByAltText'],
      ['getByLabelText', 'findByLabelText'],
      ['getByPlaceholderText', 'findByPlaceholderText'],
      ['getAllByPlaceholderText', 'findAllByPlaceholderText']
    ];
  }

  constructor(nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
  }

  createLocatingCommand(name, parentScopedElement) {
    return Utils.setFunctionName((...args) => {
      if (!parentScopedElement) {
        parentScopedElement = ScopedWebElement.root(this.nightwatchInstance);
      }

      return parentScopedElement[name](...args);
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

    return this.loadElementMethods(function(selector) {
      return new ScopedWebElement(selector, null, nightwatchInstance);
    });
  }
}

module.exports = ScopedElementAPILoader;