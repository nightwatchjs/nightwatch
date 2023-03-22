module.exports.command = function(name) {
  return this.runQueuedCommandScoped('getElementValue', name);
};