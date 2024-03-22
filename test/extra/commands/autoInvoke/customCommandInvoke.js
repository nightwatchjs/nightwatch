module.exports = class CustomCommandInvoke {
  command() {
    return this.api.perform(function() {
      this.globals.count++;
    });
  }
};

module.exports.autoInvoke = true;