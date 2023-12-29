module.exports = class CustomCommandReturnFn {
  static get returnFn() {
    return function(node, api) {
      api.globals.count++;

      return {
        status: 0
      };
    };
  }

  command() {
    this.api.perform(function() {
      this.globals.count++;
    });
  }
};
