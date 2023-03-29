module.exports.command = function() {
  const createAction = (actions, webElement) => function getFirstElementChild() {
    return actions.executeScript(function(element) {
      return element.firstElementChild;
    }, [webElement]);
  };
  const node = this.queueAction({name: 'getFirstElementChild', createAction});

  return this.createScopedElement(node.deferred.promise);
};

