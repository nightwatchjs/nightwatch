module.exports.command = function() {
  const createAction = (actions, webElement) => function getLastElementChild() {
    return actions.executeScript(function(element) {
      return element.lastElementChild;
    }, [webElement]);
  };
  const node = this.queueAction({name: 'getLastElementChild', createAction});

  return this.createScopedElement(node.deferred.promise);
};

