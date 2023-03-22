const {ScopedWebElement} = require('../index.js');

module.exports.command = function() {
  const node = this.#queueAction((actions, webElement) => function getFirstElementChild() {
    return actions.getFirstElementChild(webElement);
  });

  return ScopedWebElement.create(node.deferred.promise, this, this.nightwatchInstance);
};

