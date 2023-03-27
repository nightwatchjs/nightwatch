module.exports.command = function(destination) {
  return this.runQueuedCommand('dragElement', destination);
};