const {ScopedWebElement} = require('../index.js');

module.exports.command = function() {
  const node = this.#queueAction((actions, webElement) => function getPreviousElementSibling() {
    return actions.getPreviousSibling(webElement);
  });

  return new ScopedWebElement(node.deferred.promise, this.parentScopedElement, this.nightwatchInstance);
};

