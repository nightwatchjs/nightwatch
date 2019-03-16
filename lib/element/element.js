const LocateStrategy = require('./strategy.js');
const Utils = require('../util/utils.js');

class Element {
  static get defaultProps() {
    return [
      'name',
      'parent',
      'selector',
      'locateStrategy',
      'index',
      'abortOnFailure',
      'timeout',
      'retryInterval',
      'message',
      'pseudoSelector'
    ];
  }

  /**
   * Class that all elements subclass from.
   *
   * @param {Object} definition User-defined element options defined in page object.
   * @param {Object} [options] Additional options to be given to the element.
   * @constructor
   */
  constructor(definition, options = {}) {
    this.name = options.name;

    this.setProperties(definition, options);

    this.parent = options.parent;
    this.resolvedElement = null;
  }

  get index() {
    return parseInt(this.__index, 10);
  }

  set index(val) {
    this.__index = val;
  }

  get indexDisplay() {
    return isNaN(this.index) ? '' : `[${this.index}]`;
  }

  get usingRecursion() {
    return this.locateStrategy === LocateStrategy.Recursion;
  }

  set selector(val) {
    this.__selector = val;
  }

  get selector() {
    if (Utils.isString(this.__selector) && this.pseudoSelector && !this.__selector.includes(':')) {
      return `${this.__selector}:${this.pseudoSelector}`;
    }

    return this.__selector;
  }

  setProperties(definition, options) {
    if (!definition.selector) {
      throw new Error(`No selector property for ${getDescription(this)}. Instead found properties: ` +
        Object
          .keys(definition)
          .filter(hasValidValueIn(definition))
          .join(', ')
      );
    }

    this.__index = definition.index;
    this.__selector = definition.selector;
    this.locateStrategy = definition.locateStrategy || options.locateStrategy || LocateStrategy.getDefault();
    this.pseudoSelector = null;

    if (!Utils.isUndefined(definition.abortOnFailure)) {
      this.abortOnFailure = Utils.convertBoolean(definition.abortOnFailure);
    }

    if (!Utils.isUndefined(definition.retryInterval)) {
      this.retryInterval = definition.retryInterval;
    }

    if (definition.message) {
      this.message = definition.message;
    }

    if (!Utils.isUndefined(definition.timeout)) {
      this.timeout = definition.timeout;
    }
  }

  toString() {
    if (Array.isArray(this.selector)) { // recursive
      return this.selector.join(',');
    }

    if (!this.name) { // inline (not defined in page or section)
      return this.selector;
    }

    let classType = this.constructor.name;
    let prefix = this.constructor === Element ? '@' : '';

    return `${classType} [name=${prefix}${this.name}${this.indexDisplay}]`;
  }

  /**
   * Determines whether or not the element contains an @ element reference
   * for its selector.
   *
   * @returns {boolean} True if the selector is an element reference starting with an
   *    @ symbol, false if it does not.
   */
  hasElementSelector() {
    return String(this.selector).charAt(0) === '@';
  }

  /**
   * If the element object requires a recursive lookup to resolve its
   * selector, a new element containing the recursive lookup values
   * is created and returned.
   *
   * @returns {Object} A new Element object containing the element and its
   *    parents with a recursive lookup strategy for resolving the element
   *    if one is needed. If not, null is returned.
   */
  getRecursiveLookupElement() {
    let lookupList = getAncestorsWithElement(this);

    if (lookupList.length > 1) {
      return new Element({
        selector: lookupList,
        locateStrategy: LocateStrategy.Recursion,
        abortOnFailure: this.abortOnFailure,
        timeout: this.timeout,
        retryInterval: this.retryInterval,
        message: this.message
      });
    }

    return null;
  }

  /**
   * Copies selector properties to the first object from the second if the first
   * object has undefined or null values for any of those properties.
   *
   * @param {Object} target The object to assign values to.
   * @param {Object} source The object to capture values from.
   */
  static copyDefaults(target, source) {
    Element.defaultProps.forEach(function(prop) {
      if (target[prop] === undefined || target[prop] === null || isNaN(target[prop]) && !isNaN(source[prop])) {
        target[prop] = source[prop];
      }
    });
  }

  /**
   * Parses the value/selector parameter of an element command creating a
   * new Element instance with the values it contains, if any. The standard
   * format for this is a selector string, but additional, complex formats
   * in the form of an array or object are also supported.
   *
   * @param {string|Object|Element} value Selector value to parse into an Element.
   * @param {string} [using] The using/locateStrategy to use if the selector
   *    doesn't provide one of its own.
   */
  static createFromSelector(value, using) {
    if (!value) {
      throw new Error('Invalid selector value specified');
    }

    if (value instanceof Element) {
      value.locateStrategy = value.locateStrategy || using;

      return value;
    }

    let definition;
    let options = {
      locateStrategy: using
    };

    if (using !== LocateStrategy.Recursion && Utils.isObject(value)) {
      definition = value;
    } else {
      definition = {
        selector: value
      };
    }

    return new Element(definition, options);
  }

  /**
   * Returns true when an elements() request is needed to capture
   * the result of the Element definition.  When false, it means the
   * Element targets the first result the selector match meaning an
   * element() (single match only) result can be used.
   *
   * @param {Element} element The Element instance to check to see if
   *    it will apply filtering.
   */
  static requiresFiltering(element) {
    return !isNaN(element.index);
  }

  /**
   * Filters an elements() results array to a more specific set based
   * on an Element object's definition.
   *
   * @param {Element} element The Element instance to check to see if
   *    it will apply filtering.
   * @param {Array} resultElements Array of WebElement JSON objects
   *    returned from a call to elements() or elementIdElements().
   * @return {Array} A filtered version of the elements array or, if
   *    the filter failed (no matches found) null.
   */
  static applyFiltering(element, resultElements) {
    if (Element.requiresFiltering(element)) {
      let foundElem = resultElements[element.index];

      return foundElem ? [foundElem] : null; // null = not found
    }

    return resultElements;
  }
}

/**
 * Array filter method removing elements that may be defined (in) but
 * do not have a recognizable value.
 */
function hasValidValueIn(definition) {
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
  let elements = [];

  function addElement(e) {
    elements.unshift(e);
    if (e.parent && e.parent.selector) {
      addElement(e.parent);
    }
  }

  addElement(element);

  return elements;
}

/**
 * Gets a simple description of the element based on whether or not
 * it is used as an inline selector in a command call or a definition
 * within a page object or section.
 */
function getDescription(instance) {
  if (instance.name) {
    let classType = instance.constructor.name.toLowerCase(); // Element, Section or any other subclass's name

    return `${classType} "${instance.name}"`;
  }

  return 'selector object';
}

module.exports = Element;
