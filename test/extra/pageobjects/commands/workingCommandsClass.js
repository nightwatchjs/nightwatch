module.exports = class RealCommands {

  customFindElements(selector, callback = function(r) {return r}) {
    return this.page.findElements({
      selector,
      suppressNotFoundErrors: true
    }, function(result) {
      return callback(result ? result.value: []);
    });
  }

  async customFindElementsES6(selector) {
    const result = await this.page.findElements({
      selector,
      suppressNotFoundErrors: true
    });

    return result;
  }
};