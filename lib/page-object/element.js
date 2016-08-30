/**
 * Class that all elements subclass from
 *
 * @param {Object} definition Element options defined in page object
 * @param {Object} options Additional options to be given to the element
 * @constructor
 */
function Element(definition, options) {
  options = options || {};
  this.name = options.name;

  if (!definition.selector) {
    throw new Error('No selector property for element "' + this.getName() +
      '" Instead found properties: ' +
      Object
        .keys(definition)
        .filter(function(key) { return definition[key]; })
        .join(', ')
    );
  }

  this.selector = definition.selector;
  this.locateStrategy = definition.locateStrategy || options.locateStrategy;
  this.index = definition.index;
  this.parent = options.parent;
}

Element.prototype.toString = function() {
  return 'Element[name=@' + this.getName() + ']';
};

Element.prototype.getName = function() {
  return this.name || '(anonymous)';
};

/**
 * Determines whether or not the element contians an @ element reference
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
Element.prototype.getRecursiveLookup = function () {
  var lookupList = getAncestorsWithElement(this);

  // the lookup list will have at least the current element in it
  // if it has more, a recursive lookup is needed

  if (lookupList.length > 1) {
    return new Element({
      selector: lookupList,
      locateStrategy: 'recursion'
    });
  }

  return null;
};

/**
 * Copies selector properties from one object to object if the first
 * object has undefined values for any of those properties.
 *
 * @param {Object} target The object to assign values to.
 * @param {Object} source The object to capture values from.
 */
Element.copyDefaults = function(target, source) {
  var props = ['name', 'parent', 'selector', 'locateStrategy', 'index'];
  props.forEach(function(prop) {
    if ((target[prop] === undefined || target[prop] === null) && source[prop]) {
      target[prop] = source[prop];
    }
  });
};

/**
 * Parses the value/selector parameter of an element command creating a
 * new Element instance with the values it contains, if any. The standard
 * format for this is a selector string, but additional, complex formats
 * in the form of an array or object are also supported, allowing you to also
 * specify a locate strategy (using) and/or an element index for targeting
 * a specific element in a query that matches multiple.
 *
 * @param {string|Object} value Selector value to parse into an Element.
 * @param {string} [using] The using/locateStrategy to use if the selector
 *    doesn't provide one of its own.
 */
Element.fromSelector = function(value, using) {

  // selector values are required

  if (!value) {
    throw new Error('Invalid selector value specified');
  }

  // if the selector value is already an element, return it

  if (value instanceof Element) {
    value.locateStrategy = value.locateStrategy || using;
    return value;
  }

  // recursion values don't get parsed here. They're an array of values
  // which get parsed individually in the recursive search process

  if (using === 'recursion') {
    return new Element({
      selector: value,
      locateStrategy: 'recursion'
    });
  }

  var definition = {};

  // object value format, e.g.:
  // { selector: 'div', index (opt): 0, locateStrategy (opt): 'css selector' }

  if (value && typeof value === 'object') {

    definition.selector = value.selector;

    if ('locateStrategy' in value) {
      definition.locateStrategy = value.locateStrategy;
    }

    if ('index' in value) {
      definition.index = value.index;
    }

  // default string value format as selector, e.g.:
  // '#my-id div.my-class'

  } else {
    definition.selector = value;
  }

  // parameter using is a fallback for if a
  // locateStrategy wasn't in the selector value

  if (using && !definition.locateStrategy) {
    definition.locateStrategy = using;
  }

  return new Element(definition);
};



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
