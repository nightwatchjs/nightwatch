module.exports = {
  demoTest(client) {
    client.url('http://localhost').customCommandAppendResults().end();
  }
};