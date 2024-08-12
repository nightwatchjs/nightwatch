describe('test', function () {
  test('test isPresent', async (browser) => {
    browser
      .element('#wrong').isPresent().assert.equals(false);
  });
});
