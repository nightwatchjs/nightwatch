var PageUtils = require('./page-utils.js');
var CommandWrapper = require('./command-wrapper.js');

/**
 * Class that all sections subclass from
 *
 * @param {Object} options Section options defined in page object
 * @constructor
 */
function Section(definition, options) {

  if(!definition.selector) {
    throw new Error('No selector property for section "' + options.name +
      '" Instead found properties: ' + Object.keys(definition));
  }

  this.name = options.name;
  this.parent = options.parent;
  this.api = this.parent.api;
  this.client = this.parent.client;
  this.settings = {
    elements: {}
  };

  this.selector = definition.selector;
  this.locateStrategy = definition.locateStrategy || 'css selector';

  CommandWrapper.addWrappedCommands(this, options.commandLoader);

  PageUtils
    .createProps(this, definition.props || {})
    .createElements(this, definition.elements || {})
    .createSections(this, definition.sections || {}, options.commandLoader, options.commands || [])
    .addCommands(this, definition.commands || []);
}

Section.prototype.toString = function() {
  return 'Section[name=' + this.name + ']';
};

module.exports = Section;
