module.exports = {
  'Test if headers are captured correctly': function (browser) {
    browser.url('https://example.com', {captureHeaders: true}, function (result) {
      const headers = browser.getHeaders();

      // Ensure headers object is available
      if (!headers) {
        console.error('Headers could not be retrieved!');
        browser.assert.fail('Headers object is undefined or null');

        return;
      }

      // Log headers for debugging purposes
      console.log('Captured Headers:', headers); // eslint-disable-line no-console

      // Assertions to validate specific headers
      browser.assert.ok(headers['content-type'], 'Content-Type header is present');
      browser.assert.equal(
        headers['content-type'],
        'text/html; charset=UTF-8',
        'Content-Type header matches expected value'
      );
    });

    browser.end();
  }
};
