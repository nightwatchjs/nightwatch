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
    var el, options;

    if (!Array.isArray(elements)) {
      elements = [elements];
    }

    elements.forEach(function(els) {
      Object.keys(els).forEach(function(name) {
        el = typeof els[name] === 'string' ? { selector: els[name] } : els[name];

        options = {
          parent: parent,
          name: name,
          locateStrategy: el.locateStrategy || 'css selector'
        };

        elementObjects[name] = new Element(el, options);
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
    var sec;

    Object.keys(sections).forEach(function(s) {
      sec = sections[s];
      sec.parent = parent;
      sec.name = s;
      sec.locateStrategy = sec.locateStrategy || 'css selector';
      sectionObjects[sec.name] = new Section(sec);
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
