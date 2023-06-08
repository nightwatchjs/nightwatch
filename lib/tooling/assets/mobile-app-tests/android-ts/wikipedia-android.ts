import {NightwatchAPI} from 'nightwatch';

describe('Wikipedia Android app test', function() {
  before(function(app: NightwatchAPI) {
    app.click('id', 'org.wikipedia:id/fragment_onboarding_skip_button');
  });

  it('Search for BrowserStack', async function(app: NightwatchAPI) {
    app
      .click('id', 'org.wikipedia:id/search_container')
      .sendKeys('id', 'org.wikipedia:id/search_src_text', 'browserstack')
      .click({selector: 'org.wikipedia:id/page_list_item_title', locateStrategy: 'id', index: 0})
      .waitUntil(async function() {
        // wait for webview context to be available
        const contexts = await app.appium.getContexts();

        return contexts.includes('WEBVIEW_org.wikipedia');
      })
      .appium.setContext('WEBVIEW_org.wikipedia')
      .assert.textEquals('.pcs-edit-section-title', 'BrowserStack');  // command run in webview context
  });
});
