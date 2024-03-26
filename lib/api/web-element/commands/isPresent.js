// isPresent.js

/**
 * Check if an element is present on the page.
 *
 * @example
 * browser.element('<selector>').isPresent();
 *
 * @since 3.0.0
 * @method isPresent
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element('<selector>').isPresent()
 * @returns {Boolean} returns true if the element is present, false otherwise.
 */
module.exports.command = function() {
  return this.runQueuedCommandScoped('isElementPresent', arguments);
};
