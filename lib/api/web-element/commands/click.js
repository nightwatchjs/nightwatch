module.exports.command = function() {
  const node = this.#queueAction(
    (actions, webElement) =>
      function click() {
        return actions.clickElement(webElement);
      }
  );

  return this.#waitFor(node.deferred.promise);
}