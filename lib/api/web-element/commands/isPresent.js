
module.exports.command = function() {
  return this.runQueuedCommandScoped('isElementPresent')
    .then(result => result.value)
    .catch(() => false);
};
