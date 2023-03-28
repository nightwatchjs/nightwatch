module.exports.command = function() {
  const createAction = (actions, webElement) => function getFirstElementChild() {
    return actions.getFirstElementChild(webElement);
  };
  const node = this.queueAction({name: 'getFirstElementChild', createAction});

  return this.createScopedElement(node.deferred.promise);
};

