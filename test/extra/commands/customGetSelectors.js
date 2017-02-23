module.exports = {
  command : function(selector1, selector2, callback) {
    callback && callback([selector1.selector, selector2.selector]);
  }
};
