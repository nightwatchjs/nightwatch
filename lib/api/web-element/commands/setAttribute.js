module.exports.command = function(name, value) {
  return this.runQueuedCommand('setElementAttribute', {
    args: [name, value]
  });
};