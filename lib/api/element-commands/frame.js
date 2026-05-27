module.exports = function frame(selector) {
  const Utils = require("../util/utils.js");

  return this.executeProtocolAction({
    commandName: "frame",
    args: [Utils.isPageObject(selector) ? selector.selector : selector],
  });
};
