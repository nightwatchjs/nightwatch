module.exports = class AngularCommand {
  async command(listName, cb = function(r) {return r}) {
    return this.api.executeScript(function(listName) {
      // executed in the browser context
      // eslint-disable-next-line
      var element = document.querySelectorAll('*[ng-repeat$='+listName+'"]');
      if (element && element[0]) {return element[0]}
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
