module.exports.command = function() {
  const createAction = (actions, webElement) => function getShadowRoot() {
    return actions.getShadowRoot(webElement);
  };
  const node = this.queueAction({name: 'getShadowRoot', createAction});

  return this.createScopedElement(node.deferred.promise);
};
