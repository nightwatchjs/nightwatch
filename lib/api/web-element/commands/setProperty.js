module.exports.command = function(name, value) {
  const node = this.#queueAction(
    (actions, webElement) =>
      function setProperty() {
        return actions.setElementProperty(webElement, name, value);
      }
  );

  return this.#waitFor(node.deferred.promise);
}