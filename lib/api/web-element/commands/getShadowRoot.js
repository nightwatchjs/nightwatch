module.exports.command = function() {
  const node = this.queueAction('getShadowRoot', (actions, webElement) => function getShadowRoot() {
    return actions.getShadowRoot(webElement);
  });

  return this.createScopedElement(node.deferred.promise);
};
