module.exports.command = function(name) {
  return this.runQueuedCommandScoped('getElementProperty', name);
};