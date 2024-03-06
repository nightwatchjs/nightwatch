module.exports = {
  demoTest(client) {
    client
      .url('http://localhost')
      .setPassword('#weblogin', 'redacted_text')
      .setValue('#weblogin', 'non_redacted')
      .end();
  }
};
