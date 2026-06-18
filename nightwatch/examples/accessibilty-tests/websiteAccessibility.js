/**
 * Rules the aXe uses:
 * https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
 *
 *
 */

describe('accessibilty tests for nightwatch website', function() {

  before(async function() {
    browser.navigateTo('https://nightwatchjs.org');
    await browser.axeInject();
  });

  after(function() {
    browser.end();
  });

  it('Nightwatch website page has accessible headers', function(browser) {
    browser.axeRun('body', {
      runOnly: ['empty-heading', 'page-has-heading-one', 'p-as-heading']
    });
  });
});
