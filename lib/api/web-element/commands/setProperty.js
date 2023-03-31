module.exports.command = function(name, value) {
  return this.runQueuedCommand('setElementProperty', {
    args: [name, value]
  });
};