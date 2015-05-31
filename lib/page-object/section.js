var PageUtils = require('./page-utils.js');
var CommandWrapper = require('./command-wrapper.js');

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
  this.selector = options.selector;
  this.locateStrategy = options.locateStrategy || 'css selector';
  this.api = this.parent.api;
  this.commandLoader = this.parent.commandLoader;

  PageUtils
    .createElements(this, options.elements || {})
    .createSections(this, options.sections || {})
    .addCommands(this, options.commands || []);

  CommandWrapper.addWrappedCommands(this, this.commandLoader);
}

Section.prototype.toString = function() {
  return 'Section[name=' + this.name + ']';
};

module.exports = Section;
