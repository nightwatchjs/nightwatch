const Utils = require('../util/utils.js');
const Section = require('./section.js');
const Element = require('./element.js');

class BaseObject {
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
          name: name,
          parent: parent
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
        name: name,
        parent: parent
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
    commands.forEach(function(m) {
      Object.keys(m).forEach(function(k) {
        parent[k] = m[k];
      });
    });
  }
}

module.exports = BaseObject;