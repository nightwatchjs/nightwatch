module.exports.command = function(options) {
  return this.#waitFor(
    this.nightwatchInstance.api.axeRun(this.webElement, options)
  );
};