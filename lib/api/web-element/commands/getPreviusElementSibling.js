module.exports.command = function() {
  const node = this.queueAction('getPreviousSibling', (actions, webElement) => function getPreviousElementSibling() {
    return actions.getPreviousSibling(webElement);
  });


  return this.createScopedElement(node.deferred.promise, true);
};

