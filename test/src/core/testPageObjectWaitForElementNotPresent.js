const assert = require('assert');
const path = require('path');
const Nocks = require('../../lib/nocks.js');
const Nightwatch = require('../../lib/nightwatch.js');

describe('test PageObject WaitForElementNotPresent', function () {
  beforeEach(function (done) {
    Nocks.enable().cleanAll().createSession();
    Nightwatch.init({
      page_objects_path: path.join(__dirname, '../../extra/pageobjects/pages')
    }, function () {
      done();
    });
    this.client = Nightwatch.client();
  });

  afterEach(function () {
    Nocks.deleteSession().disable();
  });

  it('WaitForElementNotPresent with section', async function() {
    Nocks.elementFound().click().elementFound().childElementsFound('#badElement').elementFound().childElementsNotFound()

    const page = this.client.api.page.waitForElementNotPresentPageObj();

    let res;
    page.waitForElementNotPresentDemo(function(result) {
      res = result;
    })
  
    await this.client.start();
    assert.equal(res.status, 0);
  });
});
