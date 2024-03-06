module.exports.command = function(element) {
  return this.runQueuedCommandScoped('isPromise', element);
};
