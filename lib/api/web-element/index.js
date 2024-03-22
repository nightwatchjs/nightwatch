const {WebElement} = require('selenium-webdriver');
const Factory = require('./factory.js');

module.exports.active = function(nightwatchInstance) {
  const {transportActions} = nightwatchInstance;
  const node = nightwatchInstance.queue.add(function findActiveElement() {
    return transportActions.getActiveElement();
  });

  const instance = new WebElement(nightwatchInstance.transport.driver, node.deferred.promise);

  return Factory.create(instance, null, nightwatchInstance);
};

module.exports.root = function(nightwatchInstance) {
  return Factory.create(null, null, nightwatchInstance);
};

module.exports.createScopedWebElements = Factory.createScopedWebElements;
module.exports.create = Factory.create;
