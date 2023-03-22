module.exports.command = function() {
  const node = this.queueAction('getNextSibling', (actions, webElement) => function getNextElementSibling() {
    return actions.getNextSibling(webElement);
  });

  return this.createScopedElement(node.deferred.promise, true);
};

