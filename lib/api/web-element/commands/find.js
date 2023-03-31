module.exports.command = function(selector) {
  return this.createScopedElement(selector, this);
};

