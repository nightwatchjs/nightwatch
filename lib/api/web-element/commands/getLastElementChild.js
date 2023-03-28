module.exports.command = function() {
  const createAction = (actions, webElement) => function getLastElementChild() {
    return actions.getLastElementChild(webElement);
  };
  const node = this.queueAction({name: 'getLastElementChild', createAction});

  return this.createScopedElement(node.deferred.promise);
};

