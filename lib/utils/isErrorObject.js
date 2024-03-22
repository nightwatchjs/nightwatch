module.exports = function(err) {
  return err instanceof Error || Object.prototype.toString.call(err) === '[object Error]';
};
