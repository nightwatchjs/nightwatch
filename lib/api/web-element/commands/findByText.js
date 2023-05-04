const {By} = require('selenium-webdriver');

module.exports.command = function(text, {exact = true, ...options} = {}) {
  const selector = exact
    ? By.xpath(`.//*[text()="${text}"]`)
    : By.xpath(`.//*[contains(text(),"${text}")]`);

  return this.find({
    ...options,
    selector
  });
};
