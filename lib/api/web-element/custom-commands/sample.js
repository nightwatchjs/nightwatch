module.exports.command = function(...keys) {
  return this.#runQueuedCommand('sendKeysToElement', {
    args: keys
  });
};

module.exports = class CustomCommand {
  command(...args) {
    return this.transportActions.executeScript(function(element) {

    }, [this.webElement])

    return new Promise((resolve, reject) => {

    });
  }


}