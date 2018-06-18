const Utils = require('../util/utils.js');
const CommandWrapper = require('./command-wrapper.js');
const BaseObject = require('./base-object.js');

/**
 * Class that all pages subclass from
 *
 * @param {Object} options Page options defined in page object
 * @constructor
 */
class Page extends BaseObject {
  constructor(options, commandLoader, client) {
    super();

    this.__options = options;
    this.commandLoader = commandLoader;
    this.client = client;

    this.__props = Page.createProps(this, options.props);
    this.__elements = Page.createElements(this, options.elements);
    this.__sections = Page.createSections(this, options.sections);

    Page.addCommands(this, options.commands || []);

    CommandWrapper.addWrappedCommands(this, this.commandLoader);
  }

  get api() {
    return this.client.api;
  }

  get name() {
    return this.__options.name;
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

  get url() {
    return this.__options.url;
  }

  set url(val) {
    this.__options.url = val;
  }

  /**
   * Returns the url passed as an argument (or null if no arguments are passed).
   *  If the supplied url is a function, it invokes that function with the page as its context.
   *
   * @method getUrl
   * @param {function|string} url
   * @returns {string|null}
   */
  getUrl(url) {
    if (Utils.isFunction(url)) {
      return url.call(this);
    }

    if (Utils.isString(url)) {
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
