exports.command = function(selector, cb) {

  this.perform(function() {
    cb(selector);
  });

  return this;
};
