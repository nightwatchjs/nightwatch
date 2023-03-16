const Utils = require('../utils');
const Section = require('./section.js');
const Element = require('../element');

class BaseObject {
  static get WrappedProtocolCommands() {
    return [
      'element',
      'elements',
      'elementIdElement',
      'elementIdElements'
    ];
  }
  /**
   * Returns the properties object passed as an argument (or null if no arguments are passed).
   *  If the supplied properties argument is a function, it invokes that function with the page as its context.
   *
   * @param {Object} parent
   * @param {Object|Function} val
   */
  static createProps(parent, val = {}) {
    return Utils.isFunction(val) ? val.call(parent) : val;
  }

  /**
   * Assigns the `elements` property for a page or section object.
   *  For each object in the passed array, it creates a new element object by instantiating Element with its options
   *
   * @param {Object} parent
   * @param {Object|Array} elements Object or array of objects to become element objects
   */
  static createElements(parent, elements = []) {
    let elementObjects = {};

    if (!Array.isArray(elements)) {
      elements = [elements];
    }

    elements.forEach(els => {
      Object.keys(els).forEach(name => {
        let definition = Utils.isString(els[name]) ? {
          selector: els[name]
        } : els[name];

        let options = {
          name,
          parent
        };

        elementObjects[name] = new Element(definition, options);
      });
    });

    return elementObjects;
  }

  /**
   * Assigns the `section` property for a page or section object.
   *  For each object in the passed array, it creates a new section object by instantiating Section with its options
   *
   * @param {Object} parent
   * @param {object} sections
   */
  static createSections(parent, sections = {}) {
    let sectionObjects = {};

    Object.keys(sections).forEach(name => {
      let definition = sections[name];
      let options = {
        name,
        parent
      };

      sectionObjects[name] = new Section(definition, options);
    });

    return sectionObjects;
  }

  /**
   * Mixes in the passed functions to the page or section object.
   *
   * @param {Page|Section} parent The page object or section instance
   * @param {Object} commands Array of commands that will be added to the page or section
   */
  static addCommands(parent, commands) {
    if (Utils.isFunction(commands) || Utils.isObject(commands) && !Array.isArray(commands)) {
      commands = [commands];
    }

    commands.forEach(m => {
      if (Utils.isFunction(m)) {
        BaseObject.addCommandsFromClass(parent, m);
      } else {
        Object.keys(m).forEach(k => {
          try {
            parent[k] = m[k];
          } catch (err) {
            const error = new Error(`Trying to overwrite page object/section "${parent.name}"  method/property "${k}".`);
            error.detailedErr = `Using ${Object.keys(m).join(', ')}.`;

            throw error;
          }
        });
      }
    });
  }

  static addCommandsFromClass(parent, CommandClass) {
    const instance = BaseObject.createPageCommandInstance(CommandClass, parent);
    const methodNames = Utils.getAllClassMethodNames(instance, ['httpRequest']);
    methodNames.forEach(method => {
      try {
        parent[method] = function(...args) {
          return instance[method].apply(instance, args);
        };
      } catch (err) {
        const error = new Error(`Trying to overwrite page object/section "${parent.name}"  method/property "${method}".`);
        error.detailedErr = `Using ${methodNames}.`;
        error.displayed = false;

        throw error;
      }
    });
  }

  static createPageCommandInstance(CommandClass, page) {
    const {client} = page;

    class CommandInstance extends CommandClass {
      get page() {
        return page;
      }

      get section() {
        return this.page.section;
      }

      get api() {
        return this.client.api;
      }

      get browser() {
        return this.client.api;
      }

      get client() {
        return client;
      }

      get transportActions() {
        if (this.client && this.client.transport) {
          return this.client && this.client.transportActions;
        }

        return {};
      }

      get driver() {
        if (this.client && this.client.transport && this.client.transport.driver) {
          return this.client.transport.driver;
        }

        return null;
      }

      httpRequest(requestOptions) {
        return this.client.transport.runProtocolAction(requestOptions);
      }

      toString() {
        return CommandClass.toString();
      }
    }

    return new CommandInstance();
  }
}

module.exports = BaseObject;
