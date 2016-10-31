var util = require('util');
var Element = require('./element.js');
var PageUtils = require('./page-utils.js');
var CommandWrapper = require('./command-wrapper.js');

/**
 * Class that all sections subclass from
 *
 * @param {Object} definition User-defined section options defined in page object
 * @param {Object} options Additional options to be given to the section.
 * @constructor
 */
function Section(definition, options) {
  Element.call(this, definition, options);

  this.client = this.parent.client;
  this.api = this.parent.api;
  this.commandLoader = this.parent.commandLoader;

  PageUtils
    .createProps(this, definition.props || {})
    .createElements(this, definition.elements || {})
    .createSections(this, definition.sections || {})
    .addCommands(this, definition.commands || []);

  CommandWrapper.addWrappedCommands(this, this.commandLoader);
}

util.inherits(Section, Element);

module.exports = Section;
