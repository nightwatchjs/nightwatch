const {ScopedWebElement} = require('../index.js');

module.exports.command = function() {
  const node = this.#queueAction((actions, webElement) => function getLastElementChild() {
    return actions.getLastElementChild(webElement);
  });

  return new ScopedWebElement(node.deferred.promise, this, this.nightwatchInstance);
};

