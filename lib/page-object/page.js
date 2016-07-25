var PageUtils = require('./page-utils.js');
var CommandWrapper = require('./command-wrapper.js');

/**
 * Class that all pages subclass from
 *
 * @param {Object} options Page options defined in page object
 * @constructor
 */
function Page(options, commandLoader, api, client) {
  this.commandLoader = commandLoader;
  this.api = api;
  this.client = client;
  this.name = options.name;
  this.url = options.url;

  PageUtils
    .createProps(this, options.props || {})
    .createElements(this, options.elements || {})
    .createSections(this, options.sections || {})
    .addCommands(this, options.commands || []);

  CommandWrapper.addWrappedCommands(this, this.commandLoader);
}

Page.prototype = {
  /**
   * Returns the url passed as an argument (or null if no arguments are passed).
   *  If the supplied url is a function, it invokes that function with the page as its context.
   *
   * @method getUrl
   * @param {string} url
   * @returns {string|null}
   */
  getUrl: function(url) {
    if (typeof url === 'function') {
      return url.call(this);
    } else if (typeof url === 'string') {
      return url;
    }

    return null;
  },

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
  navigate: function(url, callback) {
    var goToUrl = this.getUrl(url || this.url);
    if (goToUrl === null) {
      throw new Error('Invalid URL: You must either add a url property to "' +
        this.name + '" or provide a url as an argument');
    }
    this.api.url(goToUrl, callback);
    return this;
  }
};

module.exports = Page;
