module.exports = function() {
  /**
   * Assigns a value to the `selector` property for a section or element object.
   *  In the simplest case, it assigns the passed selector as is.
   *  If the object has a parent that also has a selector (i.e., its parent is a section),
   *  it combines the two selectors to mimic element nesting.
   *  Does not support nesting xpath and css together.
   *
   * @param {string} selector The selector (must be a css selector or xpath)
   * @returns {null}
   */
  this.createSelector = function(selector) {
    if ([ 'xpath', 'css selector' ].indexOf(this.locateStrategy) < 0) {
      throw new Error('Invalid locateStrategy: "' + this.locateStrategy +
        '". Valid ones are: css selector, xpath');
    }

    if (this.parent && this.parent.selector) {
      var parentSelector = this.parent.selector;
      var locateStrategy = this.locateStrategy;

      if (locateStrategy !== this.parent.locateStrategy) {
        throw new Error('You cannot currently combine xpath and css selectors: "' +
          this.name + '" and "' + this.parent.name + '"');

      } else if (locateStrategy === 'css selector') {
        this.selector = parentSelector + ' ' + selector;

      } else if (locateStrategy === 'xpath') {
        if (selector.indexOf('//') === 0) {
          this.selector = selector;
        } else {
          this.selector = parentSelector + '//*' + selector;
        }
      }
    }
    else {
      this.selector = selector;
    }
  };

  /**
   * Assigns the `elements` property for a page or section object.
   *  For each object in the passed array, it creates a new element object by instantiating Element with its options
   *
   * @param {Array} elements Array of objects to become element objects
   * @returns {null}
   */
  this.createElements = function(elements) {
    var Element = require('./element');
    var elementObjects = {};
    var self = this;
    var el;

    for (var e in elements) {
      if (elements.hasOwnProperty(e)) {
        el = elements[e];
        el.parent = self;
        el.name = e;
        elementObjects[el.name] = new Element(el);
      }
    }
    this.elements = elementObjects;
  };

  /**
   * Assigns the `section` property for a page or section object.
   *  For each object in the passed array, it creates a new section object by instantiating Section with its options
   *
   * @param {Array} sections Array of objects to become section objects
   * @returns {null}
   */
  this.createSections = function(sections) {
    var Section = require('./section');
    var sectionObjects = {};
    var self = this;
    var sec;

    for (var s in sections) {
      if (sections.hasOwnProperty(s)) {
        sec = sections[s];
        sec.parent = self;
        sec.name = s;
        sectionObjects[sec.name] = new Section(sec);
      }
    }
    this.section = sectionObjects;
  };

  /**
   * Mixes in the passed functions to the page or section object.
   *
   * @param {Object} mixins Array of functions to be mixed in to the page or section
   * @returns {null}
   */
  this.addMixins = function(mixins) {
    var self = this;
    mixins.forEach(function(m) {
      for (var k in m) {
        if (m.hasOwnProperty(k)) {
          self[k] = m[k];
        }
      }
    });
  };
};