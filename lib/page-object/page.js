var PageUtils = require('./page-utils.js');
var CommandWrapper = require('./command-wrapper.js');

/**
 * Class that all pages subclass from
 *
 * @param {Object} options Page options defined in page object
 * @constructor
 */
function Page(options, commandLoader, api, client) {
  this.name = options.name;
  this.parent = null;
  this.api = api;
  this.client = client;
  this.props = {};
  this.section = {};
  this.settings = {
    url: options.url,
    elements: {}
  };

  // API commands are added to the page instance first, followed by
  // the other page methods (PageUtils.addCommands) which may
  // override the API commands if they have the same name

  CommandWrapper.addWrappedCommands(this, commandLoader);

  PageUtils
    .createProps(this, options.props || {})
    .createElements(this, options.elements || {})
    .createSections(this, options.sections || {}, commandLoader)
    .addCommands(this, options.commands || []);
}

Page.prototype = {

  /**
   * This command is an alias to url and also a convenience method because when called without any arguments
   *  it performs a call to .url() with passing the value of `url` property on the page object.
     * Uses `url` protocol command.
   *
   * @method navigate
   * @param {Object} [url=this.url] Url to navigate to.
   * @returns {*}
   */
  navigate: function(url) {
    var goToUrl = getUrl(url || this.settings.url);
    if (goToUrl === null) {
      throw new Error('Invalid URL: You must either add a url property to "' +
        this.name + '" or provide a url as an argument');
    }
    this.api.url(goToUrl);
    return this;
  }
};

/**
 * Returns the url passed as an argument (or null if no arguments are passed).
 *  If the supplied url is a function, it invokes that function with the page as its context.
 *
 * @method getUrl
 * @param {string} url
 * @returns {string|null}
 */
function getUrl(url) {
  if (typeof url === 'function') {
    return url.call(this);
  } else if (typeof url === 'string') {
    return url;
  }

  return null;
}

module.exports = Page;
