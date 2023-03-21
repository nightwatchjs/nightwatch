const {By} = require('selenium-webdriver');

module.exports.command = function (text, {exact = true, ...options} = {}) {
  const expr = exact ? `text()="${text}"` : `contains(text(),"${text}")`;
  const selector = By.xpath(`//*[${expr}]`);

  return this.findAll({
    ...options,
    selector
  });
};
