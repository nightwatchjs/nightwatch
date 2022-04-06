module.exports.command = async function(selector, callback = function() {}) {
  await this.url();

  const elements = await this.findElements({
    selector,
    suppressNotFoundErrors: true
  });

  callback.call(this, elements);

  return elements;
};