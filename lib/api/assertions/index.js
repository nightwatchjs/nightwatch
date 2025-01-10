/**
 * This file contains the list of all assertions available in Nightwatch.
 * 
 * @module assertions
 */

module.exports = {
  // Element assertions
  attributeContains: require('./attributeContains'),
  attributeEquals: require('./attributeEquals'),
  attributeMatches: require('./attributeMatches'),
  contains: require('./contains'),
  containsText: require('./containsText'),
  cssClassNotPresent: require('./cssClassNotPresent'),
  cssClassPresent: require('./cssClassPresent'),
  cssProperty: require('./cssProperty'),
  domPropertyContains: require('./domPropertyContains'),
  domPropertyEquals: require('./domPropertyEquals'),
  domPropertyMatches: require('./domPropertyMatches'),
  elementNotPresent: require('./elementNotPresent'),
  elementPresent: require('./elementPresent'),
  elementsCount: require('./elementsCount'),
  enabled: require('./enabled'),
  hasAttribute: require('./hasAttribute'),
  hasClass: require('./hasClass'),
  hasDescendants: require('./hasDescendants'),
  hidden: require('./hidden'),
  promisedValue: require('./promisedValue'),
  selected: require('./selected'),
  textContains: require('./textContains'),
  textEquals: require('./textEquals'),
  textMatches: require('./textMatches'),
  value: require('./value'),
  valueContains: require('./valueContains'),
  valueEquals: require('./valueEquals'),
  visible: require('./visible')
};
