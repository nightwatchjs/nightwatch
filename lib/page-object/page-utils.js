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
    var el;

    if (!Array.isArray(elements)) {
      elements = [elements];
    }

    elements.forEach(function(els) {
      Object.keys(els).forEach(function(e) {
        el = typeof els[e] === 'string' ? { selector: els[e] } : els[e];
        el.parent = parent;
        el.name = e;
        elementObjects[el.name] = new Element(el);
      });
    });

    parent.settings.elements = elementObjects;

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
  this.createSections = function(parent, sections, commandLoader) {
    var Section = require('./section.js');
    var sectionObjects = {};

    Object.keys(sections).forEach(function(sectionName) {
      var options = {
        parent: parent,
        name: sectionName,
        commandLoader: commandLoader
      };
      sectionObjects[sectionName] = new Section(sections[sectionName], options);
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
    commands.forEach(function(commandGroup) {
      Object.keys(commandGroup).forEach(function(commandName) {

        // do not overwrite a property with a wrapped command
        // (other commands (functions) are ok to overwrite)

        // TODO: issue a warning (or fatal error)? 2 cases:
        //       - overwriting an existing command function (not fatal)
        //       - skipping adding the command because it would override a property

        if (!parent.hasOwnProperty(commandName) || typeof parent[commandName] === 'function') {

          // DEBUG:
          if (typeof parent[commandName] === 'function') {
            console.warn('[DEBUG] Page command "' + commandName + '" overwriting original command of the same name.');
          }

          parent[commandName] = commandGroup[commandName];

        } else {

          // DEBUG:
          console.warn('[DEBUG] Page command "' + commandName + '" not added to ' + parent.name + ' because it would overwrite an existing property.');
        }

      });
    });

    return this;
  };
})();
