module.exports.command = function() {
  const createAction = (actions, webElement) => function() {
    return actions.executeScript(function(element) {
      return element.previousElementSibling;
    }, [webElement]);
  };
  const node = this.queueAction({name: 'getPreviousElementSibling', createAction});

  return this.createScopedElement(node.deferred.promise);
};



