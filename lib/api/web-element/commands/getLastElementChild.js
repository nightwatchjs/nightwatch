module.exports.command = function() {
  const node = this.queueAction('getLastElementChild', (actions, webElement) => function getLastElementChild() {
    return actions.getLastElementChild(webElement);
  });

  return this.createScopedElement(node.deferred.promise);
};

