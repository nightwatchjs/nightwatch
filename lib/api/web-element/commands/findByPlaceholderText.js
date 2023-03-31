const {By} = require('selenium-webdriver');

module.exports.command = function (text, {exact = true, ...options} = {}) {
  const comparingModifier = exact ? '' : '*';

  return this.find({
    ...options,
    selector: By.css(`[placeholder${comparingModifier}="${text}"]`)
  });
};
