describe('test', function () {
  test('test setPassword', async (browser) => {
    browser
      .element('#wrong').isPresent().assert.equals(false);
  });
});
