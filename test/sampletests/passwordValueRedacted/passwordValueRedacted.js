describe('value redaction in setPassword', function() { 
  test('test setPassword', async browser => {
    browser
      .setPassword('#weblogin', 'password')
      .setValue('#weblogin', 'simpletext');
  });
});
