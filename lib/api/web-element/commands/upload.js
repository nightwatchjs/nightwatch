module.exports.command = function(file) {
  return this.runQueuedCommand('uploadFile', {
    args: [file]
  });
};