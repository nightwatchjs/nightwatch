module.exports = {
  demoTestSync : function (test) {
    test.globals.test.ok('demo test sync');

    test.assert.equal(0, 0);
  },

  demoTestAsync : function(test, done) {
    setTimeout(function () {
      test.globals.test.ok('demo test async');
      done();
    }, 100);
  }
};
