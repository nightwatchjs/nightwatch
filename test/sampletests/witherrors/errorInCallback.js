module.exports = {
  errorInCallback : function (client) {
    client.url('http://localhost', function() {
      throw new Error('some url callback error');
    });
  }
};
