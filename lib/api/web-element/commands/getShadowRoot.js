const {ScopedWebElement} = require('../index.js');

module.exports.command = function() {
  const node = this.#queueAction((actions, webElement) => function getShadowRoot() {
    return actions.getShadowRoot(webElement);
  });

  return new ScopedWebElement(node.deferred.promise, this, this.nightwatchInstance);
};