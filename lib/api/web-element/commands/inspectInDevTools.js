module.exports.command = function(txt) {
  return this.runQueuedCommand('inspectInDevTools', {args: [txt]});
};
