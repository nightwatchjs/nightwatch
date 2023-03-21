module.exports.command = function(...keys) {
  return this.#runQueuedCommand('setElementValue', {
    args: keys
  });
};