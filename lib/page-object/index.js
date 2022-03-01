const Utils = require('../utils');
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

    this.commandLoader = commandLoader;

    this.__options = options;
    this.__client = client;
    this.__api = Object.assign({}, client.api);
    this.__props = Page.createProps(this, options.props);
    this.__elements = Page.createElements(this, options.elements);
    this.__sections = Page.createSections(this, options.sections);

    Page.addCommands(this, options.commands || []);

    CommandWrapper.addWrappedCommands(this, this.commandLoader);
    CommandWrapper.wrapProtocolCommands(this, this.api, BaseObject.WrappedProtocolCommands);
  }

  get api() {
    return this.__api;
  }

  get client() {
    return this.__client;
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
   * @param {function|string|object} url
   * @return {function}
   */
  get getUrl() {
    /**
     * @returns {string|null}
     */
    return (url) => {
      if (Utils.isFunction(url)) {
        return url.call(this);
      }

      if (Utils.isString(url)) {
        return url;
      }

      if (Utils.isObject(url) && this.url) {
        return Utils.replaceParams(this.url, url);
      }

      return null;
    };
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
  get navigate() {
    return function(url, callback) {
      const promise = new Promise((resolve, reject) => {
        (async () => {
          if (typeof url == 'function' && !callback) {
            callback = url;
            url = this.url;
          }
          
          if (!url) {
            url = this.url;
          }

          let goToUrl = this.getUrl(url);

          if (Utils.isString(goToUrl) && Utils.relativeUrl(goToUrl)) {
            if (!this.client.settings.launchUrl) {
              const err = new Error(`Invalid URL ${goToUrl} in "${this.name}" page object. When using relative uris, you must ` +
                'define a "baseUrl" or "launchUrl" in your nightwatch config.');

              return reject(err);
            }

            goToUrl = Utils.uriJoin(this.client.settings.launchUrl, goToUrl);
          }

          if (goToUrl === null) {
            const err = new Error('Invalid URL: You must either add a url property to "' +
              this.name + '" or provide a url as an argument');

            return reject(err);
          }

          await this.api.url(goToUrl, callback);

          resolve();
        })();
      });

      Object.assign(promise, this);

      return promise;
    };


  }
}

module.exports = Page;
