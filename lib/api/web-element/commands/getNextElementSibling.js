module.exports.command = function() {
  const createAction = (actions, webElement) => function() {
    return actions.executeScript(function(element) {
      return element.nextElementSibling;
    }, [webElement]);
  };
  const node = this.queueAction({name: 'getNextElementSibling', createAction});

  return this.createScopedElement(node.deferred.promise);
};



