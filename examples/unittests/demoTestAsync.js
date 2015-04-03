module.exports = {
  'demo UnitTest' : function (client, done) {
    client.assert.ok('TEST');
    setTimeout(function() {
      done();
    }, 500);

  }
};
