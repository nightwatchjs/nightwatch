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

  PageUtils
    .createProps(this, options.props || {})
    .createElements(this, options.elements || {})
    .createSections(this, options.sections || {}, options.commandLoader)
    .addCommands(this, options.commands || []);

  CommandWrapper.addWrappedCommands(this, options.commandLoader, true);
}

Section.prototype.toString = function() {
  return 'Section[name=' + this.name + ']';
};

module.exports = Section;
