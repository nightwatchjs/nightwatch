module.exports.command = function(...keys) {
  return this.runQueuedCommand('sendKeysToElement', {
    args: keys
  });
};