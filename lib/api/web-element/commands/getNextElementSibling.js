module.exports.command = function() {
  const createAction = (actions, webElement) => function getNextSibling() {
    return actions.getNextSibling(webElement);
  };
  const node = this.queueAction({name: 'getNextElementSibling', createAction});

  return this.createScopedElement(node.deferred.promise);
};



