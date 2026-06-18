/**
 * To learn more about the describe interface, refer to the following link:
 * https://nightwatchjs.org/guide/writing-tests/test-syntax.html
 */
describe('Title Assertion', function() {

  /**
   * This section will always execute before the test suite
   * Read More : https://nightwatchjs.org/guide/writing-tests/using-test-hooks.html#before-beforeeach-after-aftereach
   */
  before(function (browser) {
    /**
     * Navigate to a URL :
     *   - We need to navigate before performing any actions on the page
     *     Read More : https://nightwatchjs.org/api/navigateTo.html
     *
     *   - <PAGE-URL> is a placeholder. Replace it with the actual URL, which you wanted to navigate
     *
     * Eg: browser.navigateTo('https://www.github.com/');
     */

    browser.navigateTo('<PAGE-URL>');
  });


  /* The following will perform the actual test/assertions */
  it('tests title of the page', function(browser) {
    /**
     * Check title :
     *  - Use title assertion command to check if the title is present or not.
     *    Read More : https://nightwatchjs.org/api/title.html
     *
     * Eg: browser.assert.title('GitHub: Where the world builds software · GitHub');
     */

    browser.assert.title('<TITLE>');
  });


  /* The following will always execute after the test suite */
  after(function (browser) {
    // This is used to close the browser's session
    browser.end();
  });
});
