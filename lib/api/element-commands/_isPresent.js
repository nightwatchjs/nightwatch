const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Determines if an element is present in the DOM. Works like isVisible, i.e. it returns true/false
 *
 * - if there are retryable errors like StaleElementReferrence, the request should be retried using the logic from baseElementCommand
 * - any other errors should be thrown and logged
 *
 *
 * @method isPresent
 */
class isPresent extends BaseElementCommand {

}

module.exports = isPresent;