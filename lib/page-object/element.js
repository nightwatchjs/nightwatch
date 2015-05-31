/**
 * Class that all elements subclass from
 *
 * @param {Object} options Element options defined in page object
 * @constructor
 */
function Element(options) {
  this.parent = options.parent;

  if (!options.selector) {
    throw new Error('No selector property for element "' + options.name +
      '" Instead found properties: ' + Object.keys(options));
  }

  this.name = options.name;
  this.selector = options.selector;
  this.locateStrategy = options.locateStrategy || 'css selector';
}

Element.prototype.toString = function() {
  return 'Element[name=@' + this.name + ']';
};

module.exports = Element;