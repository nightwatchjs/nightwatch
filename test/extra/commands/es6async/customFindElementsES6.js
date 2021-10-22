module.exports.command = async function(selector, callback = function() {}) {
  const elements = await this.findElements({
    selector,
    suppressNotFoundErrors: true
  });

  callback(elements);

  return elements;
}