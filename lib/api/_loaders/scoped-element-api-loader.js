const Utils = require('../../utils/index.js');
const { ScopedElement } = require('../../element/scoped-element.js');

module.exports = class ScopedElementAPILoader {
  constructor(nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
  }

  #createLocatingCommand(name, parentScopedElement) {
    return Utils.setFunctionName((...parameters) => {
      if (!parentScopedElement) {
        parentScopedElement = ScopedElement.root(this.nightwatchInstance);
      }

      return parentScopedElement[name](...parameters);
    }, name);
  }

  #loadNamespaceMethodsInto(target, scopedElement) {
    const findActive = () => ScopedElement.active(this.nightwatchInstance);

    return Object.assign(target, {
      findActive,
      getActive: findActive,
      get: this.#createLocatingCommand('get', scopedElement),
      find: this.#createLocatingCommand('find', scopedElement),

      getAll: this.#createLocatingCommand('getAll', scopedElement),
      findAll: this.#createLocatingCommand('findAll', scopedElement),

      getByText: this.#createLocatingCommand('getByText', scopedElement),
      findByText: this.#createLocatingCommand('findByText', scopedElement),

      getAllByText: this.#createLocatingCommand('getAllByText', scopedElement),
      findAllByText: this.#createLocatingCommand(
        'findAllByText',
        scopedElement
      ),

      getByRole: this.#createLocatingCommand('getByRole', scopedElement),
      findByRole: this.#createLocatingCommand('findByRole', scopedElement),

      getAllByRole: this.#createLocatingCommand('getAllByRole', scopedElement),
      findAllByRole: this.#createLocatingCommand(
        'findAllByRole',
        scopedElement
      ),

      getByAltText: this.#createLocatingCommand('getByAltText', scopedElement),
      findByAltText: this.#createLocatingCommand(
        'findByAltText',
        scopedElement
      ),

      getAllByAltText: this.#createLocatingCommand(
        'getAllByAltText',
        scopedElement
      ),
      findAllByAltText: this.#createLocatingCommand(
        'findAllByAltText',
        scopedElement
      ),

      getByLabelText: this.#createLocatingCommand(
        'getByLabelText',
        scopedElement
      ),
      findByLabelText: this.#createLocatingCommand(
        'findByLabelText',
        scopedElement
      ),

      getByPlaceholderText: this.#createLocatingCommand(
        'getByPlaceholderText',
        scopedElement
      ),
      findByPlaceholderText: this.#createLocatingCommand(
        'findByPlaceholderText',
        scopedElement
      ),

      getAllByPlaceholderText: this.#createLocatingCommand(
        'getAllByPlaceholderText',
        scopedElement
      ),
      findAllByPlaceholderText: this.#createLocatingCommand(
        'findAllByPlaceholderText',
        scopedElement
      )
    });
  }

  createElementMethod() {
    const nightwatchInstance = this.nightwatchInstance;

    return this.#loadNamespaceMethodsInto(function element(selector) {
      return new ScopedElement(selector, null, nightwatchInstance);
    });
  }
};
