const {By} = require('selenium-webdriver');

module.exports.command = function (text, {exact = true} = {}) {
  const expr = exact ? `text()="${text}"` : `contains(text(),"${text}")`;
  const selector = By.xpath(`.//*[${expr}]`);

  return this.createScopedElements({selector}, {parentElement: this, commandName: 'findAllByText'});
};
