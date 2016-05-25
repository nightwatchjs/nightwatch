module.exports = {
  demoTestExcluded : function (client) {
    client.url('http://localhost').end();
  }
};
