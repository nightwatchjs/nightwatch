module.exports.command = function(name) {
  return this.runQueuedCommandScoped('getElementCSSValue', name);
};