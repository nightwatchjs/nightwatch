describe('Aniket', function() { 
  test('test setpassword', async browser => {
    browser
      .setPassword('#weblogin', 'password')
      .setValue('#weblogin', 'simpletext');
  });
});