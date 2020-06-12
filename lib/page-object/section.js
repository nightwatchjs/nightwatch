const Element = require('../element');
const CommandWrapper = require('./command-wrapper.js');

/**
 * Class that all sections subclass from
 *
 * @param {Object} definition User-defined section options defined in page object
 * @param {Object} options Additional options to be given to the section.
 * @constructor
 */
class Section extends Element {
  get section() {
    return this.sections;
  }

  /**
   * A shallow copy of the page-object api is sufficient because the wrapping of api commands (e.g. .elements()) is only one-level
   */
  createApiShallowCopy() {
    return Object.assign({}, this.parent.api);
  }


  constructor(definition, options) {
    super(definition, options);

    this.client = this.parent.client;
    this.api = this.createApiShallowCopy();
    this.commandLoader = this.parent.commandLoader;

    const BaseObject = require('./base-object.js');
    this.props = BaseObject.createProps(this, definition.props);
    this.elements = BaseObject.createElements(this, definition.elements);
    this.sections = BaseObject.createSections(this, definition.sections);

    BaseObject.addCommands(this, definition.commands || []);

    CommandWrapper.addWrappedCommands(this, this.commandLoader);
    CommandWrapper.wrapProtocolCommands(this, this.api, BaseObject.WrappedProtocolCommands);
  }
}


module.exports = Section;
