module.exports.command = function(x = 0, y = 0) {
  return this.runQueuedCommand('moveTo', {
    args: [x, y]
  });
};
