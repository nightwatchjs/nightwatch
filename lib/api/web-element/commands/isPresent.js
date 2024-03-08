module.exports.command = function(element) {
  return this.runQueuedCommandScoped('isPresent', element);
};
