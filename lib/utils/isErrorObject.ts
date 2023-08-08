export = function(err: any) {
  return err instanceof Error || Object.prototype.toString.call(err) === '[object Error]';
};
