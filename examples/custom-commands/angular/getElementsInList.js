module.exports = class AngularCommand {
  async command(listName, cb = function(r) {return r}) {
    return this.api.executeScript(function(listName) {
      // executed in the browser context
      // eslint-disable-next-line
      var elements = document.querySelectorAll('*[ng-repeat$="'+listName+'"]');
      if (elements) {return elements}
      // eslint-disable-next-line
      return null;
    }, [listName], async function(result) {
      const cbResult = await cb(result);

      if (cbResult.value) {
        return cbResult.value;
      }

      return cbResult;
    });
  }
};
