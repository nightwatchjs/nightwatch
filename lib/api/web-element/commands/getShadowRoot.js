module.exports.command = function() {
  const createAction = (actions, webElement) => function() {
    return actions.executeScript(function(element) {
      return element.shadowRoot;
    }, [webElement]);
  };
  const node = this.queueAction({name: 'getShadowRoot', createAction});

  return this.createScopedElement(node.deferred.promise);
};
