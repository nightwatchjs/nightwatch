const {ScopedWebElement} = require('../index.js');

module.exports.command = function() {
  const node = this.#queueAction((actions, webElement) => function getNextElementSibling() {
    return actions.getNextSibling(webElement);
  });

  return ScopedWebElement.create(node.deferred.promise, this.parentScopedElement, this.nightwatchInstance);
};

