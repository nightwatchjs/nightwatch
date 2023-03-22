module.exports.command = function() {
  const node = this.#queueAction('getFirstElementChild', (actions, webElement) => function getFirstElementChild() {
    return actions.getFirstElementChild(webElement);
  });

  return this.createScopedElement(node.deferred.promise);
};

