export = function(err: unknown) {
  return err instanceof Error || Object.prototype.toString.call(err) === '[object Error]';
};
