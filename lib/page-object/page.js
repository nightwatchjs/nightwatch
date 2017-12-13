const CommandWrapper = require('./command-wrapper.js');
const Element = require('./element.js');
const Section = require('./section.js');

/**
 * Class that all pages subclass from
 *
 * @param {Object} options Page options defined in page object
 * @constructor
 */
class Page {
  constructor(options, commandLoader, client) {
    this.commandLoader = commandLoader;
    this.client = client;
    this.__options = options;

    this.__props = null;
    this.__elements = null;
    this.__sections = null;

    this.props = options.props;
    this.elements = options.elements;
    this.section = options.sections;

    Page.addCommands(this, options.commands || []);

    CommandWrapper.addWrappedCommands(this, this.commandLoader);
  }

  get api() {
    return this.client.api;
  }

  get name() {
    return this.__options.name;
  }

  get url() {
    return this.__options.url;
  }

  static createApiItems(parent, items, setter) {
    parent[setter] = items;

    return Page;
  }

  /**
   * Returns the properties object passed as an argument (or null if no arguments are passed).
   *  If the supplied properties argument is a function, it invokes that function with the page as its context.
   *
   * @param {Object|Function} props Object or Function that returns an object
   */
  set props(val) {
    this.__props = typeof val === 'function' ? val.call(this) : val;
  }

  /**
   * Assigns the `elements` property for a page or section object.
   *  For each object in the passed array, it creates a new element object by instantiating Element with its options
   *
   * @param {Object|Array} elements Object or array of objects to become element objects
   */
  set elements(elements) {
    let elementObjects = {};

    if (!Array.isArray(elements)) {
      elements = [elements];
    }

    elements.forEach(els => {
      Object.keys(els).forEach(name => {
        let definition = typeof els[name] === 'string' ? {
          selector: els[name]
        } : els[name];

        let options = {
          name: name,
          parent: this
        };

        elementObjects[name] = new Element(definition, options);
      });
    });

    this.__elements = elementObjects;
  }

  /**
   * Assigns the `section` property for a page or section object.
   *  For each object in the passed array, it creates a new section object by instantiating Section with its options
   *
   * @param {object} sections
   */
  set section(sections) {
    let sectionObjects = {};

    Object.keys(sections).forEach(function(name) {
      let definition = sections[name];
      let options = {
        name: name,
        parent: parent
      };

      sectionObjects[name] = new Section(definition, options);
    });

    this.__sections = sectionObjects;
  }

  /**
   * @return {object}
   */
  get props() {
    return this.__props;
  }

  /**
   * @return {object}
   */
  get elements() {
    return this.__elements;
  }

  /**
   * @return {object}
   */
  get section() {
    return this.__sections;
  }

  /**
   * Mixes in the passed functions to the page or section object.
   *
   * @param {Page|Section} parent The page object or section instance
   * @param {Object} commands Array of commands that will be added to the age or section
   */
  static addCommands(parent, commands) {
    commands.forEach(function(m) {
      Object.keys(m).forEach(function(k) {
        parent[k] = m[k];
      });
    });

    return this;
  }

  /**
   * Returns the url passed as an argument (or null if no arguments are passed).
   *  If the supplied url is a function, it invokes that function with the page as its context.
   *
   * @method getUrl
   * @param {string} url
   * @returns {string|null}
   */
  getUrl(url) {
    if (typeof url == 'function') {
      return url.call(this);
    }

    if (typeof url == 'string') {
      return url;
    }

    return null;
  }

  /**
   * This command is an alias to url and also a convenience method because when called without any arguments
   *  it performs a call to .url() with passing the value of `url` property on the page object.
   * Uses `url` protocol command.
   *
   * @method navigate
   * @param {Object} [url=this.url] Url to navigate to.
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @returns {*}
   */
  navigate(url, callback) {
    let goToUrl = this.getUrl(url || this.url);

    if (goToUrl === null) {
      throw new Error('Invalid URL: You must either add a url property to "' +
        this.name + '" or provide a url as an argument');
    }

    this.api.url(goToUrl, callback);

    return this;
  }
}

module.exports = Page;
