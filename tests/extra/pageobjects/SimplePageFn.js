module.exports = function(client, test) {
  test.ok(typeof client == 'object');

  this.testPageAction = function() {
    return this;
  };
};