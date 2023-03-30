module.exports.command = function() {
  return this.runQueuedCommandScoped(function (webElement) {
    return webElement.getId();
  });
};