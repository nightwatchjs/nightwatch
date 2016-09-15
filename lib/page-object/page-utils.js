module.exports = new (function() {
  /**
   * Returns the properties object passed as an argument (or null if no arguments are passed).
   *  If the supplied properties argument is a function, it invokes that function with the page as its context.
   *
   * @method createProps
   * @param {Page|Section} parent The page object or section instance
   * @param {Object|Function} props Object or Function that returns an object
   * @returns {null}
   */
  this.createProps = function(parent, props) {
    parent.props = typeof props === 'function' ? props.call(parent) : props;

    return this;
  };

  /**
   * Assigns the `elements` property for a page or section object.
   *  For each object in the passed array, it creates a new element object by instantiating Element with its options
   *
   * @param {Page|Section} parent The page object or section instance
   * @param {Object|Array} elements Object or array of objects to become element objects
   * @returns {null}
   */
  this.createElements = function(parent, elements) {
    var Element = require('./element.js');
    var elementObjects = {};
    var definition;
    var options;

    if (!Array.isArray(elements)) {
      elements = [elements];
    }

    elements.forEach(function(els) {
      Object.keys(els).forEach(function(name) {
        definition = typeof els[name] === 'string' ? { selector: els[name] } : els[name];
        options = {
          name: name,
          parent: parent,
          locateStrategy: 'css selector'
        };
        elementObjects[name] = new Element(definition, options);
      });
    });

    parent.elements = elementObjects;

    return this;
  };

  /**
   * Assigns the `section` property for a page or section object.
   *  For each object in the passed array, it creates a new section object by instantiating Section with its options
   *
   * @param {Page|Section} parent The page object or section instance
   * @param {Array} sections Array of objects to become section objects
   * @returns {null}
   */
  this.createSections = function(parent, sections) {
    var Section = require('./section.js');
    var sectionObjects = {};
    var definition;
    var options;

    Object.keys(sections).forEach(function(name) {
      definition = sections[name];
      options = {
        name: name,
        parent: parent,
        locateStrategy: 'css selector'
      };
      sectionObjects[name] = new Section(definition, options);
    });

    parent.section = sectionObjects;

    return this;
  };

  /**
   * Mixes in the passed functions to the page or section object.
   *
   * @param {Page|Section} parent The page object or section instance
   * @param {Object} command Array of commands that will be added to the age or section
   * @returns {null}
   */
  this.addCommands = function(parent, commands) {
    commands.forEach(function(m) {
      Object.keys(m).forEach(function(k) {
        parent[k] = m[k];
      });
    });

    return this;
  };
})();
