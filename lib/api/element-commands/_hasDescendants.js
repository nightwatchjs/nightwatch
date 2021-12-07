const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Returns true or false based on whether the DOM has any child nodes
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Element/childElementCount
 *
 * needs to use .executeScript()
 *
 * @method hasDescendants
 */
class ElementCommand extends BaseElementCommand {

}

module.exports = ElementCommand;

