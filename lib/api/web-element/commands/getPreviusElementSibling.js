module.exports.command = function() {
  const createAction = (actions, webElement) => function getPreviousSibling() {
    return actions.getPreviousSibling(webElement);
  };
  const node = this.queueAction({name: 'getPreviousElementSibling', createAction});

  return this.createScopedElement(node.deferred.promise);
};
