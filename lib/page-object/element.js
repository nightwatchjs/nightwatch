var pageUtils = require('./page-utils');

/**
 * Class that all elements subclass from
 *
 * @param {Object} options Element options defined in page object
 * @constructor
 */
function Element(options) {
  this.parent = options.parent;
  this.client = this.parent.client;

  if (!options.selector) {
    throw new Error('No selector property for element "' + options.name +
      '" Instead found properties: ' + Object.keys(options));
  }

  this.name = options.name;
  this.api = this.parent.api;
  this.locateStrategy = options.locateStrategy || 'css selector';

  this.createSelector(options.selector);
  this.createElements(options.elements || []);
  this.addMixins(options.mixins || []);
}

pageUtils.call(Element.prototype);
module.exports = Element;