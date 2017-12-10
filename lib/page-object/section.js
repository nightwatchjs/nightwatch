const Element = require('./element.js');
const CommandWrapper = require('./command-wrapper.js');
const Page = require('./page.js');

/**
 * Class that all sections subclass from
 *
 * @param {Object} definition User-defined section options defined in page object
 * @param {Object} options Additional options to be given to the section.
 * @constructor
 */
class Section extends Element {
  constructor(definition, options) {
    super(definition, options);

    this.client = this.parent.client;
    this.api = this.parent.api;
    this.commandLoader = this.parent.commandLoader;

    Page
      .createApiItems(this, definition.props, 'props')
      .createApiItems(this, definition.sections, 'elements')
      .createApiItems(this, definition.sections, 'section')
      .addCommands(this, definition.commands || []);

    CommandWrapper.addWrappedCommands(this, this.commandLoader);
  }
}


module.exports = Section;
