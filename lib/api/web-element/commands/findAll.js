module.exports.command = function(selector) {
  return this.createScopedElements(selector, {parentElement: this, commandName: 'findAll'});
};
