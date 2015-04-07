var pageUtils = require('./page-utils');
var commandWrapper = require('./command-wrapper');

/**
 * Class that all sections subclass from
 *
 * @param {Object} options Section options defined in page object
 * @constructor
 */
function Section(options) {
  this.parent = options.parent;
  this.client = this.parent.client;

  if(!options.selector) {
    throw new Error('No selector property for section "' + options.name +
      '" Instead found properties: ' + Object.keys(options));
  }

  this.name = options.name;
  this.locateStrategy = options.locateStrategy || 'css selector';
  this.api = this.parent.api;
  this.commandLoader = this.parent.commandLoader;

  this.createSelector(options.selector);
  this.createElements(options.elements || []);
  this.createSections(options.sections || []);
  this.addMixins(options.mixins || []);

  commandWrapper.addWrappedCommands(this, this.commandLoader);
}

pageUtils.call(Section.prototype);

module.exports = Section;
