/**
 * Class that all elements subclass from.
 *
 * @param {Object} definition User-defined element options defined in page object.
 * @param {Object} [options] Additional options to be given to the element.
 * @constructor
 */
function Element(definition, options) {
  options = options || {};

  this.name = options.name;

  if (!definition.selector) {
    throw new Error('No selector property for ' + getDescription(this) +
      '. Instead found properties: ' +
      Object
        .keys(definition)
        .filter(hasValidValueIn(definition))
        .join(', ')
    );
  }

  this.selector = definition.selector;
  this.locateStrategy = definition.locateStrategy || options.locateStrategy;
  this.parent = options.parent;
}

Element.prototype.toString = function() {
  if (Array.isArray(this.selector)) { // recursive
    return this.selector.join(',');
  }
  if (!this.name) { // inline (not defined in page or section)
    return this.selector;
  }
  var classType = this.constructor.name;
  var prefix = this.constructor === Element ? '@' : '';
  return classType + '[name=' + prefix + this.name + ']';
};

/**
 * Determines whether or not the element contains an @ element reference
 * for its selector.
 *
 * @returns {boolean} True if the selector is an element reference starting with an
 *    @ symbol, false if it does not.
 */
Element.prototype.hasElementSelector = function() {
  return String(this.selector)[0] === '@';
};

/**
 * If the element object requires a recursive lookup to resolve its
 * selector, a new element containing the recursive lookup values
 * is created and returned.
 *
 * @returns {Object} A new Element object containing the element and its
 *    parents with a recursive lookup strategy for resolving the element
 *    if one is needed. If not, null is returned.
 */
Element.prototype.getRecursiveLookupElement = function () {
  var lookupList = getAncestorsWithElement(this);

  if (lookupList.length > 1) {
    return new Element({
      selector: lookupList,
      locateStrategy: 'recursion'
    });
  }

  return null;
};

/**
 * Copies selector properties to the first object from the second if the first
 * object has undefined values for any of those properties.
 *
 * @param {Object} target The object to assign values to.
 * @param {Object} source The object to capture values from.
 */
Element.copyDefaults = function(target, source) {
  var props = ['name', 'parent', 'selector', 'locateStrategy'];
  props.forEach(function(prop) {
    if (target[prop] === undefined || target[prop] === null) {
      target[prop] = source[prop];
    }
  });
};

/**
 * Parses the value/selector parameter of an element command creating a
 * new Element instance with the values it contains, if any. The standard
 * format for this is a selector string, but additional, complex formats
 * in the form of an array or object are also supported.
 *
 * @param {string|Object} value Selector value to parse into an Element.
 * @param {string} [using] The using/locateStrategy to use if the selector
 *    doesn't provide one of its own.
 */
Element.fromSelector = function(value, using) {

  if (!value) {
    throw new Error('Invalid selector value specified');
  }

  if (value instanceof Element) {
    value.locateStrategy = value.locateStrategy || using;
    return value;
  }

  var definition;
  var options = { locateStrategy: using };

  if (using !== 'recursion' && typeof value === 'object') {
    definition = value;
  } else {
    definition = { selector : value };
  }

  return new Element(definition, options);
};

/**
 * Gets a simple description of the element based on whether or not
 * it is used as an inline selector in a command call or a definition
 * within a page object or section.
 */
function getDescription(instance) {
  if (instance.name) {
    var classType = instance.constructor.name.toLowerCase(); // Element, Section or any other subclass's name
    return classType + ' "' + instance.name + '"';
  }
  return 'selector object';
}

/**
 * Array filter method removing elements that may be defined (in) but
 * do not have a recognizable value.
 */
function hasValidValueIn (definition) {
  return function(key) {
    return definition[key] !== undefined && definition[key] !== null;
  };
}

/**
 * Retrieves an array of ancestors of the supplied element. The last element in the array is the element object itself
 *
 * @param {Object} element The element
 * @returns {Array}
 */
function getAncestorsWithElement(element) {
  var elements = [];
  function addElement(e) {
    elements.unshift(e);
    if (e.parent && e.parent.selector) {
      addElement(e.parent);
    }
  }
  addElement(element);
  return elements;
}

module.exports = Element;
