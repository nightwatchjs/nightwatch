exports.command = function(selector, cb) {

  this.clearValue(selector, function(result) {
    cb(selector, result);
  });

};
